from django.contrib import admin
from .models import Service


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["name", "svc_id", "pricing", "is_active", "order"]
    list_editable = ["is_active", "order"]
    prepopulated_fields = {"svc_id": ("name",)}
