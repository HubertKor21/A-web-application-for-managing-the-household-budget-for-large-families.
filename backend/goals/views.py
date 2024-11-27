# views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SavingsGoal
from .serializers import SavingsGoalSerializer

class SavingsGoalListCreateView(APIView):
    def get(self, request):
        goals = SavingsGoal.objects.all()
        serializer = SavingsGoalSerializer(goals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SavingsGoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SavingsGoalDetailView(APIView):
    def get(self, request, pk):
        try:
            goal = SavingsGoal.objects.get(pk=pk)
        except SavingsGoal.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SavingsGoalSerializer(goal)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            goal = SavingsGoal.objects.get(pk=pk)
        except SavingsGoal.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SavingsGoalSerializer(goal, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            goal = SavingsGoal.objects.get(pk=pk)
        except SavingsGoal.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        goal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)