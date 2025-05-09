from django.db import models

class UserProfile(models.Model):
    uid = models.CharField(max_length=128, primary_key=True)
    display_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='images/', blank=True, null=True)

    def __str__(self):
        return self.email

class Wishlist(models.Model):
    user = models.ForeignKey(UserProfile, related_name='wishlist', on_delete=models.CASCADE)
    property = models.ForeignKey('listings.Property', related_name='wishlisted_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'property')