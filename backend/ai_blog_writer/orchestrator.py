from .agents import TopicsAgent, BlogAuthor, FactChecker, SEOOptimizer, ImageCreator
from django.conf import settings
from blog.models import Post, Category, Tag
from django.contrib.auth.models import User
import json

class BlogOrchestrator:
    def __init__(self):
        self.topics_agent = TopicsAgent()
        self.author_agent = BlogAuthor()
        self.fact_checker = FactChecker()
        self.seo_optimizer = SEOOptimizer()
        self.image_creator = ImageCreator()

    def get_portfolio_context(self):
        from projects.models import Project
        from skills.models import Skill
        
        projects = Project.objects.all()[:5]
        skills = Skill.objects.all()
        
        context = "Projects:\n"
        for p in projects:
            context += f"- {p.title}: {p.description[:100]}... Tech: {p.tech_stack}\n"
        
        context += "\nSkills:\n"
        for s in skills:
            context += f"- {s.name} ({s.category})\n"
            
        return context

    def generate_topics(self):
        context = self.get_portfolio_context()
        topics_json = self.topics_agent.generate_topics(context)
        try:
            return json.loads(topics_json)
        except:
            # Fallback if AI doesn't return pure JSON
            return topics_json

    def generate_draft(self, topic, description):
        return self.author_agent.write_article(topic, description)

    def fact_check(self, content):
        return self.fact_checker.review_article(content)

    def optimize_seo(self, title, content):
        seo_json = self.seo_optimizer.optimize(title, content)
        try:
            return json.loads(seo_json)
        except:
            return seo_json

    def get_image_prompt(self, title, content):
        summary = content[:500]
        return self.image_creator.generate_image_prompt(title, summary)
