from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, AllowAny
from django.contrib.auth import get_user_model
from .orchestrator import BlogOrchestrator
import json
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

        # Auto-generate an excerpt from the first ~300 chars of content.
        # Strip leading Markdown heading lines (e.g. "# Title") so the excerpt
        # reads as clean prose rather than a raw heading.
        excerpt = ""
        if content:
            lines = content.strip().splitlines()
            prose_lines = [l for l in lines if not l.strip().startswith("#")]
            prose_text = " ".join(l.strip() for l in prose_lines if l.strip())
            excerpt = prose_text[:300].rsplit(" ", 1)[0] if len(prose_text) > 300 else prose_text
            
        tags_input = request.data.get("tags", [])
        # Save to database
        from blog.models import Post, Tag
        from django.utils.text import slugify
        
        User = get_user_model()
        author = request.user if request.user.is_authenticated else User.objects.first()
        
        post = Post.objects.create(
            title=title,
            content=content,
            excerpt=excerpt,
            meta_description=meta_description,
            author=author,
            is_published=False  # Keep as draft by default
        )
        
        for tag_name in tags_input:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            post.tags.add(tag)
            
        post.save()
        
        # Generate Featured Image if requested using Hugging Face InferenceClient
        image_generated = False
        image_error = None
        if image_prompt:
            try:
                from huggingface_hub import InferenceClient
                import io
                hf_api_key = config("HUGGINGFACE_API_KEY", default="")
                client = InferenceClient(api_key=hf_api_key if hf_api_key else None)
                # Use FLUX.1-dev — HF's recommended model for text-to-image
                image = client.text_to_image(
                    prompt=image_prompt,
                    model="black-forest-labs/FLUX.1-dev",
                )
                # image is a PIL Image — convert to bytes
                buffer = io.BytesIO()
                image.save(buffer, format="PNG")
                image_data = buffer.getvalue()
                filename = f"blog-ai-{post.slug}.png"
                post.featured_image.save(filename, ContentFile(image_data), save=True)
                image_generated = True
                print(f"Featured image saved: {filename}")
            except Exception as e:
                image_error = str(e)
                print(f"Failed to generate featured image via Hugging Face: {e}")
        
        return Response({
            "status": "published",
            "slug": post.slug,
            "image_generated": image_generated,
            "image_error": image_error,
        })
