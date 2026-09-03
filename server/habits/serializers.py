from rest_framework import serializers

from .models import Habit, HabitLog, Streak


class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = [
            'id',
            'name',
            'description',
            'frequency',
            'days_interval',
            'category',
            'archived',
            'owner',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def validate(self, attrs):
        frequency = attrs.get('frequency', getattr(self.instance, 'frequency', None))
        days_interval = attrs.get('days_interval', getattr(self.instance, 'days_interval', None))

        if frequency == 'custom' and not days_interval:
            raise serializers.ValidationError(
                {'days_interval': "days_interval is required when frequency is 'custom'."}
            )

        return attrs


class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['id', 'date', 'completed', 'note', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Streak
        fields = ['current_streak', 'longest_streak', 'last_completed_date']


class CheckInSerializer(serializers.Serializer):
    date = serializers.DateField(required=False)
    completed = serializers.BooleanField(required=False, default=True)
    note = serializers.CharField(
        required=False, allow_blank=True, allow_null=True, max_length=500
    )
