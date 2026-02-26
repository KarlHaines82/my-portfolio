import urllib.request
import json
from django.conf import settings
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Skill
from .serializers import SkillSerializer


class SkillListView(generics.ListAPIView):
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Skill.objects.all()


class GitHubStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        username = getattr(settings, "GITHUB_USERNAME", "KarlHaines82")
        try:
            headers = {"User-Agent": "portfolio-app"}
            # Fetch user profile
            with urllib.request.urlopen(
                urllib.request.Request(
                    f"https://api.github.com/users/{username}",
                    headers=headers,
                )
            ) as resp:
                user_data = json.loads(resp.read())

            # Fetch repos
            with urllib.request.urlopen(
                urllib.request.Request(
                    f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated",
                    headers=headers,
                )
            ) as resp:
                repos = json.loads(resp.read())

            # Aggregate languages
            languages = {}
            for repo in repos:
                if repo.get("language"):
                    lang = repo["language"]
                    languages[lang] = languages.get(lang, 0) + 1

            total = sum(languages.values()) or 1
            languages_pct = {
                lang: round(count / total * 100, 1)
                for lang, count in sorted(languages.items(), key=lambda x: -x[1])
            }

            return Response(
                {
                    "username": username,
                    "avatar_url": user_data.get("avatar_url"),
                    "name": user_data.get("name"),
                    "bio": user_data.get("bio"),
                    "public_repos": user_data.get("public_repos", 0),
                    "followers": user_data.get("followers", 0),
                    "following": user_data.get("following", 0),
                    "languages": languages_pct,
                    "top_repos": [
                        {
                            "name": r["name"],
                            "description": r.get("description"),
                            "url": r["html_url"],
                            "stars": r.get("stargazers_count", 0),
                            "language": r.get("language"),
                        }
                        for r in sorted(repos, key=lambda r: -r.get("stargazers_count", 0))[:6]
                    ],
                }
            )
        except Exception as e:
            return Response({"error": str(e)}, status=503)
