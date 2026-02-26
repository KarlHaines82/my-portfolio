from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Category, Comment, Post, Tag


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at"]


class PostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    featured_image = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "author", "excerpt",
            "featured_image", "categories", "tags",
            "meta_description", "is_published", "created_at", "updated_at",
        ]

    def get_featured_image(self, obj):
        if obj.featured_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
        return None


class PostDetailSerializer(PostListSerializer):
    comments = serializers.SerializerMethodField()
    schema_org_json = serializers.JSONField(read_only=True)

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + ["content", "comments", "schema_org_json"]

    def get_comments(self, obj):
        approved = obj.comments.filter(is_approved=True)
        return CommentSerializer(approved, many=True).data


class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["content"]
