from rest_framework import generics, permissions
from .models import Testimonial
from .serializers import TestimonialSerializer


class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Testimonial.objects.filter(is_published=True)
