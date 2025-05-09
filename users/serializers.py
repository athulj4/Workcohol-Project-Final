from rest_framework import serializers
from .models import UserProfile, Wishlist

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['uid', 'display_name', 'email', 'phone', 'photo']

class WishlistSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=__import__('listings').models.Property.objects.all())
    class Meta:
        model = Wishlist
        fields = ['id', 'property']