from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "is_featured", "order", "created_at"]
    list_editable = ["is_featured", "order"]
    prepopulated_fields = {"slug": ("title",)}
