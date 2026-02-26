from django.db import models


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("languages", "Languages"),
        ("frameworks", "Frameworks"),
        ("databases", "Databases"),
        ("devops", "DevOps"),
        ("tools", "Tools"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=100)
    level = models.PositiveIntegerField(default=50, help_text="Proficiency 0-100")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="other")
    icon = models.CharField(max_length=100, blank=True, help_text="Icon class e.g. devicon-python-plain")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["category", "order", "name"]

    def __str__(self):
        return f"{self.name} ({self.level}%)"
