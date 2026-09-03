from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator


class MeSerializer(serializers.ModelSerializer):
    subscription_tier = serializers.CharField(source="profile.subscription_tier", read_only=True)
    subscription_status = serializers.CharField(source="profile.subscription_status", read_only=True)
    subscription_current_period_end = serializers.DateTimeField(
        source="profile.subscription_current_period_end", read_only=True
    )
    is_premium = serializers.BooleanField(source="profile.is_premium", read_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "subscription_tier",
            "subscription_status",
            "subscription_current_period_end",
            "is_premium",
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
