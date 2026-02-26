from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),
    path("api/blog/", include("blog.urls")),
    path("api/skills/", include("skills.urls")),
    path("api/resume/", include("resume.urls")),
    path("api/services/", include("services.urls")),
    path("api/contact/", include("contact.urls")),
    path("api/projects/", include("projects.urls")),
    path("api/testimonials/", include("testimonials.urls")),
    path("api/pages/", include("pages.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
