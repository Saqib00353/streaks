from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Habit
from .serializers import HabitSerializer


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
        queryset = Habit.objects.filter(owner=self.request.user)

        if self.action == 'list':
            include_archived = self.request.query_params.get('include_archived', 'false')
            if include_archived.lower() != 'true':
                queryset = queryset.filter(archived=False)

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
