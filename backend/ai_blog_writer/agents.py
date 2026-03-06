import os
import google.generativeai as genai
from decouple import config


class BaseAgent:
    def __init__(self, model="gemini-2.5-flash"):
        # Prioritize GEMINI_API_KEY since google.generativeai targets Google AI Studio
        api_key = config(
            "GEMINI_API_KEY", default=config("VERTEX_AI_API_KEY", default="")
        )
        genai.configure(api_key=api_key)
        self.model = model

    def get_completion(self, messages, temperature=0.7):
        system_instruction = ""
        user_content = ""

        for m in messages:
            if m["role"] == "system":
                system_instruction += m["content"] + "\n"
            elif m["role"] == "user":
                user_content += m["content"] + "\n"

        model_instance = genai.GenerativeModel(
            model_name=self.model,
            system_instruction=(
                system_instruction.strip() if system_instruction else None
            ),
            generation_config=genai.types.GenerationConfig(
                temperature=temperature,
            ),
        )

        response = model_instance.generate_content(user_content.strip())
        text = response.text

        # Clean up markdown code blocks to ensure JSON parses correctly in orchestrator
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]

        if text.endswith("```"):
            text = text[:-3]

        return text.strip()


class TopicsAgent(BaseAgent):
    def generate_topics(self, portfolio_context):
        prompt = f"""
        You are a highly creative Content Strategist and Topic Scout for a developer portfolio website.
        Based on the following context about the developer's projects and skills, generate a list of 5 unique, 
        engaging, and highly relevant blog post topics.
        
        Developer Context:
        {portfolio_context}
        
        The topics should appeal to other developers and potential clients. They should blend technical expertise with personal insight.
        Return the response as a JSON list of objects with "title" and "description" keys.
        """
        messages = [
            {"role": "system", "content": "You are a content strategist."},
            {"role": "user", "content": prompt},
        ]
        return self.get_completion(messages)


class BlogAuthor(BaseAgent):
    def write_article(self, topic, description, style_context=""):
        prompt = f"""
        You are an expert technical blogger. Write a long-form, engaging blog post about the following topic.
        Topic: {topic}
        Description: {description}
        
        Style Notes: {style_context or 'Professional, yet conversational. Cyberpunk/Tech-forward tone.'}
        
        Include:
        - A catchy headline.
        - An engaging introduction.
        - Detailed sections with clear subheadings (Markdown).
        - A concluding thought or call to action.
        - Relevant code snippets if applicable.
        """
        messages = [
            {"role": "system", "content": "You are an expert technical author."},
            {"role": "user", "content": prompt},
        ]
        return self.get_completion(messages)


class FactChecker(BaseAgent):
    def review_article(self, content):
        prompt = f"""
        Review the following blog post for factual accuracy, technical correctness, and logical consistency.
        
        Article Content:
        {content}
        
        Provide a list of corrections or suggestions for improvement. If everything is correct, state so.
        Return the response in Markdown.
        """
        messages = [
            {
                "role": "system",
                "content": "You are a meticulous fact-checker and technical reviewer.",
            },
            {"role": "user", "content": prompt},
        ]
        return self.get_completion(messages)


class SEOOptimizer(BaseAgent):
    def optimize(self, title, content):
        prompt = f"""
        Optimize the following blog post for SEO. 
        Title: {title}
        Content: {content}
        
        Provide:
        1. A list of 5-8 relevant keywords/tags.
        2. A compelling meta description (max 160 characters).
        3. Suggestions for improving the content's searchability.
        
        Return the response as a JSON object with keys: "tags", "meta_description", "suggestions".
        """
        messages = [
            {
                "role": "system",
                "content": "You are an SEO expert specializing in technical content.",
            },
            {"role": "user", "content": prompt},
        ]
        return self.get_completion(messages)


class ImageCreator(BaseAgent):
    def generate_image_prompt(self, title, content_summary):
        prompt = f"""
        Create a detailed prompt for an AI image generator (like DALL-E) to create a featured image for a blog post.
        Title: {title}
        Summary: {content_summary}
        
        The style should be high-quality, digital art, with a cyberpunk/futuristic aesthetic. 
        Focus on abstract technical concepts, vibrant neons, and sleek interfaces.
        
        Return ONLY the prompt string.
        """
        messages = [
            {
                "role": "system",
                "content": "You are a creative director and prompt engineer.",
            },
            {"role": "user", "content": prompt},
        ]
        return self.get_completion(messages)
