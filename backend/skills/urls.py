from django.urls import path
from .views import GitHubStatsView, SkillListView

urlpatterns = [
    path("", SkillListView.as_view(), name="skill-list"),
    path("github/", GitHubStatsView.as_view(), name="github-stats"),
]
