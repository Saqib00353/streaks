from django.db import models
from django.contrib.auth.models import User
from common.models import TimestampedModel

class Profile(TimestampedModel):
    TIER_CHOICES = [
        ('free', 'Free'),
        ('premium', 'Premium'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('incomplete', 'Incomplete'),
        ('trialing', 'Trialing'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    subscription_tier = models.CharField(max_length=10, choices=TIER_CHOICES, default='free')
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    subscription_status = models.CharField(max_length=20, choices=STATUS_CHOICES, blank=True, null=True)
    subscription_current_period_end = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} {self.subscription_tier}" 

    @property
    def is_premium(self):
        return self.subscription_tier == 'premium' and self.subscription_status == 'active'
