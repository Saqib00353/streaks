from django.contrib import admin
from .models import Profile

# Register your models here.

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'subscription_tier', 'subscription_status' ,'subscription_current_period_end')

    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'user__username')