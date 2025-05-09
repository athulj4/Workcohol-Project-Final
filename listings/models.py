from django.db import models

class Property(models.Model):
    title       = models.CharField(max_length=200)
    description = models.TextField()
    price       = models.DecimalField(max_digits=12, decimal_places=2)
    created_at  = models.DateTimeField(auto_now_add=True)

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image    = models.ImageField(upload_to='properties/')
