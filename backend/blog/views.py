from django.contrib.syndication.views import Feed
from django.utils.feedgenerator import Rss201rev2Feed
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Comment, Post, Tag
from .serializers import (
    CategorySerializer,
    CommentCreateSerializer,
    CommentSerializer,
    PostDetailSerializer,
    PostListSerializer,
    TagSerializer,
)


class PostListView(generics.ListAPIView):
    serializer_class = PostListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "content", "excerpt"]

    def get_queryset(self):
        qs = Post.objects.filter(is_published=True).prefetch_related(
            "categories", "tags", "author"
        )
        category = self.request.query_params.get("category")
        tag = self.request.query_params.get("tag")
        if category:
            qs = qs.filter(categories__slug=category)
        if tag:
            qs = qs.filter(tags__slug=tag)
        return qs


class PostDetailView(generics.RetrieveAPIView):
    serializer_class = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    queryset = Post.objects.filter(is_published=True).prefetch_related(
        "categories", "tags", "author", "comments__author"
    )


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.all()


class TagListView(generics.ListAPIView):
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Tag.objects.all()


class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        slug = self.kwargs.get("slug")
        post = Post.objects.get(slug=slug, is_published=True)
        serializer.save(author=self.request.user, post=post)


class LatestPostsFeed(Feed):
    title = "Developer Portfolio Blog"
    link = "/blog/"
    description = "Latest posts from the developer portfolio blog."
    feed_type = Rss201rev2Feed

    def items(self):
        return Post.objects.filter(is_published=True).order_by("-created_at")[:20]

    def item_title(self, item):
        return item.title

    def item_description(self, item):
        return item.excerpt

    def item_pubdate(self, item):
        return item.created_at

    def item_author_name(self, item):
        return item.author.get_full_name() or item.author.username
