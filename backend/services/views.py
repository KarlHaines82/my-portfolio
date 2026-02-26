from rest_framework import generics, permissions
from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Service.objects.filter(is_active=True)
