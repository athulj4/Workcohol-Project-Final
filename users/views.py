from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import UserProfile, Wishlist
from .serializers import UserProfileSerializer, WishlistSerializer
from rest_framework.decorators import action

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        wish = self.get_object()
        wish.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)