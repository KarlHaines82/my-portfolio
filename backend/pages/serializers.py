from rest_framework import serializers
from .models import Page


class PageSerializer(serializers.ModelSerializer):
    headshot = serializers.SerializerMethodField()
    resume_file = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = [
            "id", "slug", "title", "subtitle", "content",
            "meta_description", "headshot", "resume_file", "updated_at",
        ]

    def get_headshot(self, obj):
        if obj.headshot:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.headshot.url)
        return None

    def get_resume_file(self, obj):
        if obj.resume_file:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
        return None
