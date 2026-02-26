from rest_framework import serializers
from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    featured_photo = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ["id", "svc_id", "name", "description", "pricing", "featured_photo", "order"]

    def get_featured_photo(self, obj):
        if obj.featured_photo:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.featured_photo.url)
        return None
