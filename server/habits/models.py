from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from common.models import TimestampedModel


class Habit(TimestampedModel):
    FREQUENCY_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('custom', 'Custom'),
    ]
    CATEGORY_CHOICES = [
        ('health', 'Health & Fitness'),
        ('mindfulness', 'Mindfulness'),
        ('learning', 'Learning'),
        ('productivity', 'Productivity'),
        ('finance', 'Finance'),
        ('social', 'Social'),
        ('creativity', 'Creativity'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES)
    days_interval = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Only used when frequency='custom'. E.g. 3 = every 3 days.",
    )
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def allowed_streak_gap(self):
        if self.frequency == 'daily':
            return timedelta(days=1)
        if self.frequency == 'weekly':
            return timedelta(days=7)
        return timedelta(days=self.days_interval or 1)

    def recalculate_streak(self):
        """Recompute this habit's Streak from its completed logs.

        Walks completed dates newest-first and keeps extending the streak while
        consecutive dates are within the frequency's allowed gap (1 day for
        daily habits, 7 days for weekly, days_interval for custom). Recomputing
        from scratch keeps this correct whether a log was just checked in or
        un-checked, regardless of date order.
        """
        streak, _ = Streak.objects.get_or_create(habit=self)

        completed_dates = list(
            self.habit_logs.filter(completed=True).order_by('-date').values_list('date', flat=True)
        )

        if not completed_dates:
            streak.current_streak = 0
            streak.last_completed_date = None
            streak.save()
            return streak

        allowed_gap = self.allowed_streak_gap()
        most_recent = completed_dates[0]
        streak.last_completed_date = most_recent

        if timezone.localdate() - most_recent > allowed_gap:
            streak.current_streak = 0
            streak.save()
            return streak

        current_streak = 1
        prev_date = most_recent
        for log_date in completed_dates[1:]:
            if prev_date - log_date <= allowed_gap:
                current_streak += 1
                prev_date = log_date
            else:
                break

        streak.current_streak = current_streak
        streak.longest_streak = max(streak.longest_streak, current_streak)
        streak.save()
        return streak


class HabitLog(TimestampedModel):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='habit_logs')
    date = models.DateField()
    completed = models.BooleanField(default=False)
    note = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        unique_together = ('habit', 'date') 

    def __str__(self):
        return f"{self.habit.name} - {self.date}"


class Streak(TimestampedModel):
    habit = models.OneToOneField(Habit, on_delete=models.CASCADE, related_name='streak')
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_completed_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.habit.name} streak: {self.current_streak}"