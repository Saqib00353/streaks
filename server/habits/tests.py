from datetime import timedelta

from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Habit, HabitLog


class HabitCheckInTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='pass1234')
        self.client.force_authenticate(user=self.user)
        self.habit = Habit.objects.create(
            name='Read',
            frequency='daily',
            category='learning',
            owner=self.user,
        )
        self.today = timezone.localdate()

    def check_in_url(self, habit):
        return reverse('habit-check-in', args=[habit.pk])

    def test_check_in_creates_log_and_starts_streak(self):
        response = self.client.post(self.check_in_url(self.habit), {'date': str(self.today)})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['streak']['current_streak'], 1)
        self.assertEqual(response.data['streak']['longest_streak'], 1)
        self.assertTrue(HabitLog.objects.filter(habit=self.habit, date=self.today, completed=True).exists())

    def test_daily_streak_increments_on_consecutive_days(self):
        for offset in range(3):
            day = self.today - timedelta(days=2 - offset)
            response = self.client.post(self.check_in_url(self.habit), {'date': str(day)})

        self.assertEqual(response.data['streak']['current_streak'], 3)
        self.assertEqual(response.data['streak']['longest_streak'], 3)
        self.assertEqual(response.data['streak']['last_completed_date'], str(self.today))

    def test_daily_streak_resets_after_gap(self):
        self.client.post(self.check_in_url(self.habit), {'date': str(self.today - timedelta(days=5))})
        response = self.client.post(self.check_in_url(self.habit), {'date': str(self.today)})

        self.assertEqual(response.data['streak']['current_streak'], 1)
        self.assertEqual(response.data['streak']['longest_streak'], 1)

    def test_weekly_habit_allows_up_to_seven_day_gap(self):
        weekly_habit = Habit.objects.create(
            name='Meal prep',
            frequency='weekly',
            category='health',
            owner=self.user,
        )

        self.client.post(self.check_in_url(weekly_habit), {'date': str(self.today - timedelta(days=7))})
        response = self.client.post(self.check_in_url(weekly_habit), {'date': str(self.today)})

        self.assertEqual(response.data['streak']['current_streak'], 2)

    def test_uncompleting_a_log_recalculates_streak(self):
        yesterday = self.today - timedelta(days=1)
        self.client.post(self.check_in_url(self.habit), {'date': str(yesterday)})
        self.client.post(self.check_in_url(self.habit), {'date': str(self.today)})

        response = self.client.post(
            self.check_in_url(self.habit), {'date': str(self.today), 'completed': False}
        )

        self.assertEqual(response.data['streak']['current_streak'], 1)
        self.assertEqual(response.data['streak']['last_completed_date'], str(yesterday))

    def test_check_in_defaults_to_today_and_completed_true(self):
        response = self.client.post(self.check_in_url(self.habit), {})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(HabitLog.objects.filter(habit=self.habit, date=self.today, completed=True).exists())

    def test_streak_expires_when_no_recent_checkin(self):
        stale_date = self.today - timedelta(days=5)
        response = self.client.post(self.check_in_url(self.habit), {'date': str(stale_date)})

        self.assertEqual(response.data['streak']['current_streak'], 0)
        self.assertEqual(response.data['streak']['last_completed_date'], str(stale_date))

    def test_custom_frequency_requires_days_interval(self):
        response = self.client.post(
            reverse('habit-list'),
            {'name': 'Water plants', 'frequency': 'custom', 'category': 'other'},
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('days_interval', response.data)

    def test_custom_frequency_streak_uses_days_interval(self):
        custom_habit = Habit.objects.create(
            name='Water plants',
            frequency='custom',
            days_interval=3,
            category='other',
            owner=self.user,
        )

        self.client.post(self.check_in_url(custom_habit), {'date': str(self.today - timedelta(days=3))})
        response = self.client.post(self.check_in_url(custom_habit), {'date': str(self.today)})

        self.assertEqual(response.data['streak']['current_streak'], 2)

    def test_custom_frequency_breaks_beyond_days_interval(self):
        custom_habit = Habit.objects.create(
            name='Water plants',
            frequency='custom',
            days_interval=3,
            category='other',
            owner=self.user,
        )

        self.client.post(self.check_in_url(custom_habit), {'date': str(self.today - timedelta(days=4))})
        response = self.client.post(self.check_in_url(custom_habit), {'date': str(self.today)})

        self.assertEqual(response.data['streak']['current_streak'], 1)

    def test_cannot_check_in_to_another_users_habit(self):
        other_user = User.objects.create_user(username='bob', password='pass1234')
        other_habit = Habit.objects.create(
            name='Run',
            frequency='daily',
            category='health',
            owner=other_user,
        )

        response = self.client.post(self.check_in_url(other_habit), {'date': str(self.today)})

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class HabitFreeTierLimitTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='pass1234')
        self.client.force_authenticate(user=self.user)

    def create_habit(self, name):
        return self.client.post(
            reverse('habit-list'),
            {'name': name, 'frequency': 'daily', 'category': 'other'},
        )

    def test_free_tier_can_create_up_to_three_active_habits(self):
        for i in range(3):
            response = self.create_habit(f'Habit {i}')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_free_tier_rejects_fourth_active_habit(self):
        for i in range(3):
            self.create_habit(f'Habit {i}')

        response = self.create_habit('One too many')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('limit', response.data)
        self.assertEqual(Habit.objects.filter(owner=self.user).count(), 3)

    def test_archiving_a_habit_frees_up_a_slot(self):
        habits = [self.create_habit(f'Habit {i}').data for i in range(3)]
        Habit.objects.filter(pk=habits[0]['id']).update(archived=True)

        response = self.create_habit('Replacement habit')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_premium_user_is_not_limited(self):
        self.user.profile.subscription_tier = 'premium'
        self.user.profile.subscription_status = 'active'
        self.user.profile.save()

        for i in range(3):
            self.create_habit(f'Habit {i}')

        response = self.create_habit('Fourth habit')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
