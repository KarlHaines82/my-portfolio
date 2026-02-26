from rest_framework import generics, permissions
from rest_framework.generics import get_object_or_404
from .models import Page
from .serializers import PageSerializer


class PageDetailView(generics.RetrieveAPIView):
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        return get_object_or_404(Page, slug=self.kwargs["slug"], is_published=True)
