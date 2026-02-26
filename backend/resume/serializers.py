from rest_framework import serializers
from .models import Education, Experience, ResumeFile


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ["id", "company", "position", "start_date", "end_date", "description", "location", "order"]


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ["id", "school", "degree", "field_of_study", "start_date", "end_date", "description", "order"]


class ResumeFileSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = ResumeFile
        fields = ["id", "label", "file", "uploaded_at"]

    def get_file(self, obj):
        request = self.context.get("request")
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None
