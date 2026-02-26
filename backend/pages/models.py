from django.db import models


class Page(models.Model):
    """CMS-style page model for editable portfolio pages."""
    slug = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=300, blank=True)
    content = models.TextField(blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    headshot = models.ImageField(upload_to="pages/", blank=True, null=True)
    resume_file = models.FileField(upload_to="resume/", blank=True, null=True)
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["slug"]

    def __str__(self):
        return self.title
