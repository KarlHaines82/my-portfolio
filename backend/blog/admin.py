from django.contrib import admin
from .models import Category, Comment, Post, Tag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "is_published", "created_at"]
    list_filter = ["is_published", "categories", "tags"]
    search_fields = ["title", "content"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["categories", "tags"]
    readonly_fields = ["schema_org_json", "created_at", "updated_at"]
    fieldsets = (
        (None, {"fields": ("title", "slug", "author", "is_published")}),
        ("Content", {"fields": ("content", "excerpt", "featured_image")}),
        ("SEO", {"fields": ("meta_description", "schema_org_json")}),
        ("Taxonomy", {"fields": ("categories", "tags")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["author", "post", "is_approved", "created_at"]
    list_filter = ["is_approved"]
    actions = ["approve_comments"]

    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True)
    approve_comments.short_description = "Approve selected comments"
