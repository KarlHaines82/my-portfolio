from django.db import models


class Service(models.Model):
    svc_id = models.SlugField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    pricing = models.CharField(max_length=200, blank=True)
    featured_photo = models.ImageField(upload_to="services/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name
