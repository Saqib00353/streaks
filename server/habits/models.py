from django.db import models
from django.contrib.auth.models import User
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
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name


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