from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import Bank, Budget
from .serializers import BankSerializer, BudgetSerializer, BankNameSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum
class BankListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get all bank accounts of the logged-in user"""
        banks = Bank.objects.filter(user=request.user)
        serializer = BankSerializer(banks, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new bank account"""
        serializer = BankSerializer(data=request.data)
        if serializer.is_valid():
            # Set the user to the logged-in user before saving
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    
class CurrentMonthBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the current date to determine the month and year
        now = timezone.now()
        current_year = now.year
        current_month = now.month

        # Calculate the total balance for the current month
        total_balance = Budget.objects.filter(
            created_at__year=current_year,
            created_at__month=current_month,
            family_id=request.user.family
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            "year": current_year,
            "month": current_month,
            "total_balance": total_balance
        })
    
class BankNameListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        banks = Bank.objects.filter(user=request.user)
        serializer = BankNameSerializer(banks, many=True)
        return Response(serializer.data)