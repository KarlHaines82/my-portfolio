from django.urls import path
from .views import (
    GenerateTopicsView, 
    GenerateDraftView, 
    FactCheckView, 
    SEOOptimizeView, 
    GenerateImagePromptView,
    PublishBlogView
)

urlpatterns = [
    path('generate-topics/', GenerateTopicsView.as_view(), name='generate-topics'),
    path('generate-draft/', GenerateDraftView.as_view(), name='generate-draft'),
    path('fact-check/', FactCheckView.as_view(), name='fact-check'),
    path('seo-optimize/', SEOOptimizeView.as_view(), name='seo-optimize'),
    path('image-prompt/', GenerateImagePromptView.as_view(), name='image-prompt'),
    path('publish-blog/', PublishBlogView.as_view(), name='publish-blog'),
]
