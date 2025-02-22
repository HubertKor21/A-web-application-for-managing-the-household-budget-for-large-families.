from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Bank, Budget, Transaction
from .serializers import BankSerializer, BudgetSerializer, BankNameSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum
class BankListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Pobieramy rodzinę zalogowanego użytkownika
        family = request.user.family
        
        # Pobieramy wszystkie banki przypisane do tej rodziny
        banks = Bank.objects.filter(family=family)  # Filtrowanie po rodzinie
        serializer = BankSerializer(banks, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Tworzenie nowego konta bankowego dla rodziny"""
        serializer = BankSerializer(data=request.data)
        if serializer.is_valid():
            # Przypisujemy użytkownika i rodzinę do banku
            family = request.user.family
            serializer.save(user=request.user, family=family)  # Ustawiamy użytkownika i rodzinę
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, bank_id):
        """Aktualizacja istniejącego konta bankowego"""
        try:
            # Pobieramy bank na podstawie ID (pk)
            bank = Bank.objects.get(pk=bank_id, family=request.user.family)  # Filtrowanie po rodzinie
        except Bank.DoesNotExist:
            return Response({"detail": "Bank account not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Używamy istniejącego banku do aktualizacji danych
        serializer = BankSerializer(bank, data=request.data, partial=True)  # partial=True pozwala na aktualizację tylko części danych
        if serializer.is_valid():
            serializer.save()  # Zapisujemy zaktualizowane dane
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, bank_id):
        try:
            bank = Bank.objects.get(pk=bank_id, family=request.user.family)  # Poprawka: użycie `pk=bank_id` zamiast `bank_id`
            bank.delete()
            return Response({"detail": "Bank account deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Bank.DoesNotExist:
            return Response({"detail": "Bank account not found."}, status=status.HTTP_404_NOT_FOUND)

class BudgetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get the current budget of the logged-in user's family"""
        try:
            budget = Budget.objects.get(family_id=request.user.family)
            serializer = BudgetSerializer(budget)
            return Response(serializer.data)
        except Budget.DoesNotExist:
            return Response({"detail": "Budget not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        """Update the budget"""
        try:
            budget = Budget.objects.get(family_id=request.user.family)
        except Budget.DoesNotExist:
            return Response({"detail": "Budget not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BudgetSerializer(budget, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class IncomeByDateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        family = request.user.family
        # Pobierz wszystkie transakcje związane z bankami rodziny
        transactions = Transaction.objects.filter(bank__family=family).order_by('date')

        # Grupowanie według dat i pobieranie kwot
        dates = []
        income = []
        for transaction in transactions:
            dates.append(transaction.date)
            income.append(transaction.amount)

        return Response({
            "dates": dates,
            "income": income
        })

class CurrentMonthBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the current date to determine the month and year
        now = timezone.now()
        current_year = now.year
        current_month = now.month

        # Calculate the total balance for the current month
        total_balance = Transaction.objects.filter(
            date__year=current_year,
            date__month=current_month,
            bank__family_id=request.user.family
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "year": current_year,
            "month": current_month,
            "total_balance": total_balance
        })
    
class BankNameListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        family = request.user.family 
        banks = Bank.objects.filter(family = family)
        serializer = BankNameSerializer(banks, many=True)
        return Response(serializer.data)
    

class PreviousMonthBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        now = timezone.now()
        current_year = now.year
        current_month = now.month

        # Ustalamy poprzedni miesiąc
        if current_month == 1:
            previous_month = 12
            year = current_year - 1
        else:
            previous_month = current_month - 1
            year = current_year

        # Pobieramy dane z poprzedniego miesiąca
        total_balance = Transaction.objects.filter(
            date__year=year,
            date__month=previous_month,
            bank__family_id=request.user.family
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "year": year,
            "month": previous_month,
            "total_balance": total_balance
        })
    
class AllPreviousMonthBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        now = timezone.now()
        current_year = now.year

        # Lista wyników dla każdego miesiąca
        monthly_balances = []

        # Iterujemy przez miesiące 1-12
        for month in range(1, 13):
            # Suma transakcji dla danego miesiąca
            total_balance = Transaction.objects.filter(
                date__year=current_year,
                date__month=month,
                bank__family=request.user.family
            ).aggregate(total=Sum('amount'))['total'] or 0

            # Suma sald bankowych oparta na transakcjach w danym miesiącu
            total_expenses = Transaction.objects.filter(
                date__year=current_year,
                date__month=month,
                bank__family=request.user.family
            ).aggregate(total=Sum('bank__balance'))['total'] or 0

            # Dodajemy wynik do listy
            monthly_balances.append({
                "month": month,
                "total_balance": total_balance,
                "total_expenses": total_expenses,
            })

        # Zwracamy odpowiedź
        return Response({
            "year": current_year,
            "monthly_balances": monthly_balances
        })