from django.db import models

class UserProfile(models.Model):
    uid = models.CharField(max_length=128, primary_key=True)
    display_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    photo = models.ImageField(upload_to='images/', blank=True, null=True)

    def __str__(self):
        return self.email