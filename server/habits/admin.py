from django.contrib import admin
from .models import Habit, HabitLog, Streak

@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ('name', 'frequency', 'category', 'archived')

    search_fields = ('name',)
    
@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ('habit', 'date', 'completed', 'note')

    search_fields = ('habit__name', 'date', 'note')

@admin.register(Streak)
class StreakAdmin(admin.ModelAdmin):
    list_display = ('habit', 'current_streak', 'longest_streak', 'last_completed_date')

    search_fields = ('habit__name',)