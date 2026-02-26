from django.contrib import admin
from .models import Education, Experience, ResumeFile


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ["position", "company", "start_date", "end_date", "order"]
    list_editable = ["order"]


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ["degree", "field_of_study", "school", "start_date", "order"]
    list_editable = ["order"]


@admin.register(ResumeFile)
class ResumeFileAdmin(admin.ModelAdmin):
    list_display = ["label", "is_active", "uploaded_at"]
