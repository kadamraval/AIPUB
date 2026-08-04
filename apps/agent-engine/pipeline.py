import time
from typing import Dict, Any
from state import ContentState
from agents.agent_system import (
    SupervisorAgent, ResearchAgent, TrendAgent, KeywordAgent,
    PlanningAgent, WritingAgent, FactCheckAgent, ProofreadingAgent,
    SEOAgent, ImageAgent, PublisherAgent, SocialMediaAgent, AnalyticsAgent
)

class ContentPipelineGraph:
    """
    LangGraph state graph orchestrator running the 13-agent pipeline.
    """
    def __init__(self):
        self.supervisor = SupervisorAgent()
        self.research = ResearchAgent()
        self.trend = TrendAgent()
        self.keyword = KeywordAgent()
        self.planning = PlanningAgent()
        self.writing = WritingAgent()
        self.fact_check = FactCheckAgent()
        self.proofread = ProofreadingAgent()
        self.seo = SEOAgent()
        self.image = ImageAgent()
        self.publisher = PublisherAgent()
        self.social = SocialMediaAgent()
        self.analytics = AnalyticsAgent()

    def run(self, site_id: str, topic: str, brand_voice: Dict = None, seo_defaults: Dict = None) -> ContentState:
        state: ContentState = {
            "site_id": site_id,
            "target_topic": topic,
            "brand_voice": brand_voice or {"tone": "authoritative"},
            "seo_defaults": seo_defaults or {},
            "research_output": None,
            "trend_score": None,
            "keyword_output": None,
            "article_outline": None,
            "draft_content": None,
            "fact_check_results": None,
            "proofread_content": None,
            "seo_metadata": None,
            "generated_images": None,
            "published_post_id": None,
            "social_posts": None,
            "current_agent": "Initiated",
            "logs": [],
            "total_tokens": 0,
            "total_cost": 0.0,
            "status": "running"
        }

        # Sequence execution across 13 agents
        agents_sequence = [
            self.supervisor, self.research, self.trend, self.keyword,
            self.planning, self.writing, self.fact_check, self.proofread,
            self.seo, self.image, self.publisher, self.social, self.analytics
        ]

        for agent in agents_sequence:
            state = agent.process(state)

        return state

if __name__ == "__main__":
    pipeline = ContentPipelineGraph()
    result = pipeline.run(
        site_id="11111111-1111-1111-1111-111111111111",
        topic="Autonomous AI Publishing Platforms"
    )
    print("Pipeline Execution Completed!")
    print(f"Status: {result['status']}")
    print(f"Total AI Cost: ${result['total_cost']:.4f}")
    print(f"Total Tokens Used: {result['total_tokens']}")
    print(f"Published WordPress Post ID: {result['published_post_id']}")
