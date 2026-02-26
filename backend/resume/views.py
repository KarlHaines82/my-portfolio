from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Education, Experience, ResumeFile
from .serializers import EducationSerializer, ExperienceSerializer, ResumeFileSerializer


class ResumeView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        experience = Experience.objects.all()
        education = Education.objects.all()
        resume_file = ResumeFile.objects.filter(is_active=True).first()
        return Response(
            {
                "experience": ExperienceSerializer(experience, many=True).data,
                "education": EducationSerializer(education, many=True).data,
                "resume_file": ResumeFileSerializer(
                    resume_file, context={"request": request}
                ).data
                if resume_file
                else None,
            }
        )
