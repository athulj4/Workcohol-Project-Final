from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Property, PropertyImage
from .serializers import PropertySerializer

class PropertyViewSet(viewsets.ModelViewSet):
    """
    endpoints:
      GET /properties/ => list, filter, pagination
      POST /properties/ + images[] => create
      GET /properties/<id>/ => retrieve
      PUT/PATCH /properties/<id>/ => update
      DELETE /properties/<id>/ => delete
    """
    queryset = Property.objects.all().order_by('-created_at')
    serializer_class = PropertySerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        prop = serializer.save()
        for img in request.FILES.getlist('images'):
            PropertyImage.objects.create(property=prop, image=img)
        return Response(self.get_serializer(prop).data, status=status.HTTP_201_CREATED)

