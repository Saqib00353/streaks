from datetime import timedelta

from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Habit, HabitLog
from .serializers import CheckInSerializer, HabitLogSerializer, HabitSerializer, StreakSerializer


class HabitViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = HabitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Habit.objects.filter(owner=self.request.user).select_related('streak')

        if self.action == 'list':
            include_archived = self.request.query_params.get('include_archived', 'false')
            if include_archived.lower() != 'true':
                queryset = queryset.filter(archived=False)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='check-in')
    def check_in(self, request, pk=None):
        habit = self.get_object()

        serializer = CheckInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        log, _ = HabitLog.objects.update_or_create(
            habit=habit,
            date=data.get('date', timezone.localdate()),
            defaults={
                'completed': data.get('completed', True),
                'note': data.get('note'),
            },
        )

        streak = habit.recalculate_streak()

        return Response(
            {
                'log': HabitLogSerializer(log).data,
                'streak': StreakSerializer(streak).data,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['get'], url_path='logs')
    def logs(self, request, pk=None):
        habit = self.get_object()

        try:
            days = int(request.query_params.get('days', 21))
        except ValueError:
            days = 21
        days = max(1, min(days, 90))

        start = timezone.localdate() - timedelta(days=days - 1)
        logs = habit.habit_logs.filter(date__gte=start).order_by('date')

        return Response(HabitLogSerializer(logs, many=True).data)
