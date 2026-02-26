from rest_framework import generics, permissions
from .models import Project
from .serializers import ProjectSerializer


class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Project.objects.all()
