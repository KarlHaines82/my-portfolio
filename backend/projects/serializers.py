from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    featured_image = serializers.SerializerMethodField()
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "title", "slug", "description", "tech_stack", "tech_stack_list",
            "live_url", "repo_url", "featured_image", "is_featured", "order", "created_at",
        ]

    def get_featured_image(self, obj):
        if obj.featured_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
        return None

    def get_tech_stack_list(self, obj):
        return [t.strip() for t in obj.tech_stack.split(",") if t.strip()]
