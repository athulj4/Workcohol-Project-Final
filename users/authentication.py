import firebase_admin
from firebase_admin import auth
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import UserProfile

firebase_admin.initialize_app()

class FirebaseTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        header = request.META.get('HTTP_AUTHORIZATION')
        if not header:
            return None
        parts = header.split()
        if parts[0].lower() != 'bearer':
            return None
        token = parts[1]
        try:
            decoded = auth.verify_id_token(token)
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid Firebase token')
        uid = decoded['uid']
        user, _ = UserProfile.objects.get_or_create(
            uid=uid,
            defaults={'email': decoded.get('email', ''), 'display_name': decoded.get('name', '')}
        )
        return (user, None)