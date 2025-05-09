from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from .models import Property, PropertyImage
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = PropertySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop = serializer.save()
        for f in request.FILES.getlist('images'):
            PropertyImage.objects.create(property=prop, image=f)
        return Response(PropertySerializer(prop).data, status=status.HTTP_201_CREATED)

