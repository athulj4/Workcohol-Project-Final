from rest_framework import serializers
from .models import Property, PropertyImage

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'location', 'property_type',
            'price', 'bedrooms', 'bathrooms', 'created_at', 'images'
        ]
        # Alternatively, to include all fields:
        # fields = '__all__'
