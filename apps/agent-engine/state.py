from typing import TypedDict, List, Dict, Optional, Any

class ContentState(TypedDict):
    """
    Global state object passed through the 13-Agent LangGraph Pipeline.
    """
    site_id: str
    target_topic: str
    brand_voice: Dict[str, Any]
    seo_defaults: Dict[str, Any]

    # Pipeline Phase Outputs
    research_output: Optional[Dict[str, Any]]
    trend_score: Optional[float]
    keyword_output: Optional[Dict[str, Any]]
    article_outline: Optional[Dict[str, Any]]
    draft_content: Optional[str]
    fact_check_results: Optional[Dict[str, Any]]
    proofread_content: Optional[str]
    seo_metadata: Optional[Dict[str, Any]]
    generated_images: Optional[List[Dict[str, Any]]]
    published_post_id: Optional[int]
    social_posts: Optional[Dict[str, Any]]

    # System tracking
    current_agent: str
    logs: List[Dict[str, Any]]
    total_tokens: int
    total_cost: float
    status: str  # pending, running, completed, error
