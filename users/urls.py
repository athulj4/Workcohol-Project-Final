from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileView, WishlistViewSet

router = DefaultRouter()
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('', include(router.urls)),
]