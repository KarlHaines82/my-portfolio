from django.contrib import admin
from .models import Testimonial


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ["client_name", "client_company", "rating", "is_published", "order"]
    list_editable = ["is_published", "order"]
