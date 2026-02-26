"""
Management command to seed the database with sample demo content.
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils.text import slugify


class Command(BaseCommand):
    help = "Seed database with sample portfolio data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding data...")

        # Create or get admin user
        admin, created = User.objects.get_or_create(
            username="admin",
            defaults={"email": "admin@portfolio.dev", "is_staff": True, "is_superuser": True},
        )
        if created:
            admin.set_password("Admin1234!")
            admin.first_name = "Karl"
            admin.last_name = "Haines"
            admin.save()
            self.stdout.write(f"  Created admin user (password: Admin1234!)")
        else:
            self.stdout.write("  Admin user already exists")

        # Pages
        from pages.models import Page
        Page.objects.get_or_create(
            slug="about",
            defaults={
                "title": "About Me",
                "subtitle": "Senior Systems Architect & Full-Stack Engineer",
                "content": """Born in the silicon valleys of the old world, I've spent the last decade navigating the complex architectures of the modern web. My mission is to bridge the gap between human intuition and machine precision.

I specialize in building high-performance, secure, and scalable web applications. From distributed systems to immersive front-end experiences, I bring a full-stack mindset to every challenge.

**Core Directives:**
- Performance Optimization
- Scalable Architecture
- Security Hardening
- UX Immersion

Currently based remotely, available worldwide.""",
                "meta_description": "Senior Full-Stack Developer & Systems Architect specializing in distributed systems and immersive web experiences.",
                "is_published": True,
            },
        )
        self.stdout.write("  Created About page")

        # Skills
        from skills.models import Skill
        skills_data = [
            ("Python", 95, "languages"), ("JavaScript", 90, "languages"),
            ("TypeScript", 85, "languages"), ("SQL", 80, "databases"),
            ("Django", 92, "frameworks"), ("React", 88, "frameworks"),
            ("Next.js", 82, "frameworks"), ("FastAPI", 78, "frameworks"),
            ("PostgreSQL", 82, "databases"), ("Redis", 75, "databases"),
            ("Docker", 85, "devops"), ("Kubernetes", 70, "devops"),
            ("Linux", 88, "devops"), ("Git", 90, "tools"),
            ("AWS", 75, "devops"), ("Nginx", 80, "devops"),
        ]
        for i, (name, level, cat) in enumerate(skills_data):
            Skill.objects.get_or_create(name=name, defaults={"level": level, "category": cat, "order": i})
        self.stdout.write(f"  Created {len(skills_data)} skills")

        # Experience
        from resume.models import Experience, Education
        from datetime import date
        Experience.objects.get_or_create(
            company="Freelance",
            position="Senior Full-Stack Developer",
            defaults={
                "start_date": date(2020, 1, 1),
                "end_date": None,
                "description": "Building web applications for clients worldwide. Specializing in Django REST APIs, React/Next.js frontends, and AWS deployments.",
                "location": "Remote",
                "order": 0,
            },
        )
        Experience.objects.get_or_create(
            company="TechCorp Inc.",
            position="Backend Engineer",
            defaults={
                "start_date": date(2017, 3, 1),
                "end_date": date(2020, 1, 1),
                "description": "Designed and maintained microservices architecture. Led the migration from monolith to containerized microservices using Docker and Kubernetes.",
                "location": "Austin, TX",
                "order": 1,
            },
        )
        Education.objects.get_or_create(
            school="University of Texas",
            degree="B.S.",
            defaults={
                "field_of_study": "Computer Science",
                "start_date": date(2013, 8, 1),
                "end_date": date(2017, 5, 1),
                "description": "Focus on distributed systems and software engineering.",
                "order": 0,
            },
        )
        self.stdout.write("  Created experience & education entries")

        # Services
        from services.models import Service
        services_data = [
            ("full-stack-dev", "Full-Stack Web Development", "Building high-performance, secure, and scalable web applications with modern architectures.", "Starting at $2,000"),
            ("api-dev", "API Design & Development", "RESTful and GraphQL API design. Django REST Framework, FastAPI, OpenAPI specs.", "Starting at $1,500"),
            ("consulting", "Technical Consulting", "Architecture reviews, code audits, performance optimization, and DevOps best practices.", "$200/hr"),
            ("devops", "DevOps & Cloud", "Docker, Kubernetes, CI/CD pipelines, AWS/GCP deployments, and infrastructure as code.", "Starting at $1,000"),
        ]
        for svc_id, name, desc, pricing in services_data:
            Service.objects.get_or_create(svc_id=svc_id, defaults={"name": name, "description": desc, "pricing": pricing})
        self.stdout.write(f"  Created {len(services_data)} services")

        # Projects
        from projects.models import Project
        projects_data = [
            ("Portfolio API", "Full-stack developer portfolio backend with Django REST Framework, JWT auth, and social login.", "Django, DRF, PostgreSQL, Docker", "https://github.com/KarlHaines82", True),
            ("Neon Terminal UI", "Cyberpunk-themed React portfolio frontend with Tailwind CSS and dynamic animations.", "React, Next.js, TypeScript, TailwindCSS", "https://github.com/KarlHaines82/neon-folio", True),
            ("Distributed Task Queue", "High-throughput task queue with Redis pub/sub, worker pools, and dead-letter queues.", "Python, Redis, Docker, Celery", "https://github.com/KarlHaines82", False),
        ]
        for title, desc, tech, repo, featured in projects_data:
            Project.objects.get_or_create(slug=slugify(title), defaults={"title": title, "description": desc, "tech_stack": tech, "repo_url": repo, "is_featured": featured})
        self.stdout.write(f"  Created {len(projects_data)} projects")

        # Testimonials
        from testimonials.models import Testimonial
        Testimonial.objects.get_or_create(
            client_name="Sarah Chen",
            defaults={
                "client_title": "CTO",
                "client_company": "StartupXYZ",
                "content": "Karl delivered exceptional work on our platform rebuild. The new API handles 10x our previous traffic with zero downtime. Highly recommended.",
                "rating": 5,
                "order": 0,
            },
        )
        Testimonial.objects.get_or_create(
            client_name="Marcus Webb",
            defaults={
                "client_title": "Product Manager",
                "client_company": "DevAgency",
                "content": "Outstanding technical expertise and communication. Delivered ahead of schedule with clean, well-documented code.",
                "rating": 5,
                "order": 1,
            },
        )
        self.stdout.write("  Created testimonials")

        # Blog categories and sample post
        from blog.models import Category, Tag, Post
        category, _ = Category.objects.get_or_create(name="Technology", defaults={"slug": "technology"})
        tag1, _ = Tag.objects.get_or_create(name="Python", defaults={"slug": "python"})
        tag2, _ = Tag.objects.get_or_create(name="API", defaults={"slug": "api"})

        post, created = Post.objects.get_or_create(
            slug="getting-started-with-django-and-nextjs",
            defaults={
                "title": "Getting Started with Django + Next.js",
                "author": admin,
                "content": """# Building Modern Full-Stack Apps with Django and Next.js

The combination of Django REST Framework and Next.js has become one of my favorite stacks for building robust, scalable web applications. In this post, I'll walk through the key architectural decisions.

## Why Django?

Django's "batteries included" philosophy means you get an ORM, admin interface, authentication, and more out of the box. Combined with Django REST Framework, you have a powerful API layer in minutes.

## Why Next.js?

Next.js offers the best of both worlds: server-side rendering for SEO, static generation for performance, and client-side rendering for interactivity.

## Authentication Flow

Using Auth.js (formerly NextAuth) with Django JWT tokens creates a seamless authentication experience. The key is using djangorestframework-simplejwt on the backend and configuring Auth.js callbacks to store and refresh tokens.

```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "SIGNING_KEY": SECRET_KEY,
    "ALGORITHM": "HS512",
}
```

## Conclusion

This stack gives you a production-ready foundation with excellent DX. The Django admin is your content management system, and Next.js delivers blazing-fast frontend performance.
""",
                "excerpt": "The combination of Django REST Framework and Next.js creates a powerful full-stack foundation. Here's how to set it up correctly with JWT authentication and social login.",
                "meta_description": "Learn how to build modern full-stack apps with Django REST Framework and Next.js with JWT authentication and social login.",
                "is_published": True,
            },
        )
        if created:
            post.categories.add(category)
            post.tags.add(tag1, tag2)
        self.stdout.write("  Created sample blog post")

        self.stdout.write(self.style.SUCCESS("\nSeed data complete! ✓"))
        self.stdout.write("Admin credentials: admin / Admin1234!")
