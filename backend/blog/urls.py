from django.urls import path

from .views import (
    CategoryListView,
    CommentCreateView,
    LatestPostsFeed,
    PostDetailView,
    PostListView,
    TagListView,
)

urlpatterns = [
    path("posts/", PostListView.as_view(), name="post-list"),
    path("posts/<slug:slug>/", PostDetailView.as_view(), name="post-detail"),
    path("posts/<slug:slug>/comments/", CommentCreateView.as_view(), name="comment-create"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("tags/", TagListView.as_view(), name="tag-list"),
    path("rss/", LatestPostsFeed(), name="rss-feed"),
]
