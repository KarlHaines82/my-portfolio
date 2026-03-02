from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from .orchestrator import BlogOrchestrator
import json
import requests
from django.core.files.base import ContentFile
from decouple import config

class GenerateTopicsView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        orchestrator = BlogOrchestrator()
        topics = orchestrator.generate_topics()
        return Response({"topics": topics})

class GenerateDraftView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        topic = request.data.get("topic")
        description = request.data.get("description")
        if not topic:
            return Response({"error": "Topic is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        orchestrator = BlogOrchestrator()
        draft = orchestrator.generate_draft(topic, description)
        return Response({"draft": draft})

class FactCheckView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        content = request.data.get("content")
        orchestrator = BlogOrchestrator()
        review = orchestrator.fact_check(content)
        return Response({"review": review})

class SEOOptimizeView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        title = request.data.get("title")
        content = request.data.get("content")
        orchestrator = BlogOrchestrator()
        seo = orchestrator.optimize_seo(title, content)
        return Response({"seo": seo})

class GenerateImagePromptView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        title = request.data.get("title")
        content = request.data.get("content")
        orchestrator = BlogOrchestrator()
        prompt = orchestrator.get_image_prompt(title, content)
        return Response({"prompt": prompt})

class PublishBlogView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        title = request.data.get("title")
        content = request.data.get("content")
        meta_description = request.data.get("meta_description")
        image_prompt = request.data.get("image_prompt")
        
        # Truncate meta_description to avoid DataError if the AI generates too many characters
        if meta_description and len(meta_description) > 160:
            meta_description = meta_description[:157] + "..."
            
        tags_input = request.data.get("tags", [])
        # Save to database
        from blog.models import Post, Tag
        from django.utils.text import slugify
        
        User = get_user_model()
        author = request.user if request.user.is_authenticated else User.objects.first()
        
        post = Post.objects.create(
            title=title,
            content=content,
            meta_description=meta_description,
            author=author,
            is_published=False # Keep as draft by default
        )
        
        for tag_name in tags_input:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            post.tags.add(tag)
            
        post.save()
        
        # Generate Featured Image if requested using free Hugging Face Inference API
        if image_prompt:
            try:
                # Using a popular free stable diffusion model on Hugging Face
                API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large"
                # While HF has a free tier that works without a key, providing one is more reliable
                hf_api_key = config("HUGGINGFACE_API_KEY", default="")
                headers = {"Authorization": f"Bearer {hf_api_key}"} if hf_api_key else {}
                
                response = requests.post(API_URL, headers=headers, json={"inputs": image_prompt})
                
                if response.status_code == 200:
                    image_data = response.content
                    filename = f"blog-ai-{post.slug}.png"
                    post.featured_image.save(filename, ContentFile(image_data), save=True)
                else:
                    print(f"Failed to generate image via Hugging Face. Status {response.status_code}: {response.text}")
            except Exception as e:
                print(f"Failed to generate featured image via Hugging Face: {e}")
        
        return Response({"status": "published", "slug": post.slug})
