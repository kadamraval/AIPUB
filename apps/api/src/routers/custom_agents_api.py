from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid

router = APIRouter()

class AgentSkillDTO(BaseModel):
    name: str
    description: str

class CustomAgentCreate(BaseModel):
    name: str
    role_description: str
    skills: List[AgentSkillDTO]
    permitted_integrations: List[str] = []
    permitted_sources: List[str] = []
    system_prompt: str

MOCK_CUSTOM_AGENTS = [
    {
        "id": "agent-1",
        "name": "Autonomous Research Agent",
        "role_description": "Monitors RSS feeds, Google News, and GitHub changelogs",
        "skills": [
            {"name": "RSS Feed Scraper Skill", "description": "Extracts top news entries using feedparser"},
            {"name": "Web Content Parser Skill", "description": "Cleans text paragraphs with BeautifulSoup"}
        ],
        "permitted_integrations": ["google_news", "github"],
        "permitted_sources": ["TechCrunch AI Feed", "Google News AI Stream"],
        "system_prompt": "You are a master research agent. Aggregate objective facts and citations.",
        "status": "active"
    },
    {
        "id": "agent-2",
        "name": "fal.ai & Freepik Visual Asset Agent",
        "role_description": "Generates widescreen featured images & infographics",
        "skills": [
            {"name": "fal.ai Flux Skill", "description": "Generates 16:9 high-res artwork via fal.ai Flux.1"},
            {"name": "Freepik MCP Skill", "description": "Fetches vector banners via Freepik MCP protocol"}
        ],
        "permitted_integrations": ["fal_ai", "freepik"],
        "permitted_sources": [],
        "system_prompt": "You are a visual design agent. Create compelling visual asset prompts.",
        "status": "active"
    },
    {
        "id": "agent-3",
        "name": "WordPress REST Publisher Agent",
        "role_description": "Connects securely to WP REST API and posts formatted articles",
        "skills": [
            {"name": "WordPress REST Sync Skill", "description": "Posts HTML, categories, and tags via Application Passwords"}
        ],
        "permitted_integrations": ["wordpress"],
        "permitted_sources": [],
        "system_prompt": "You are a publishing agent. Ensure valid JSON-LD schemas and WP post status.",
        "status": "active"
    }
]

@router.get("/")
def get_custom_agents():
    return MOCK_CUSTOM_AGENTS

@router.post("/")
def create_custom_agent(payload: CustomAgentCreate):
    agent_id = f"agent-{uuid.uuid4().hex[:6]}"
    entry = {
        "id": agent_id,
        "name": payload.name,
        "role_description": payload.role_description,
        "skills": [s.model_dump() for s in payload.skills],
        "permitted_integrations": payload.permitted_integrations,
        "permitted_sources": payload.permitted_sources,
        "system_prompt": payload.system_prompt,
        "status": "active"
    }
    MOCK_CUSTOM_AGENTS.append(entry)
    return entry

@router.put("/{agent_id}")
def update_custom_agent(agent_id: str, payload: CustomAgentCreate):
    for item in MOCK_CUSTOM_AGENTS:
        if item["id"] == agent_id:
            item["name"] = payload.name
            item["role_description"] = payload.role_description
            item["skills"] = [s.model_dump() for s in payload.skills]
            item["permitted_integrations"] = payload.permitted_integrations
            item["permitted_sources"] = payload.permitted_sources
            item["system_prompt"] = payload.system_prompt
            return item
    raise HTTPException(status_code=404, detail="Agent not found")

@router.delete("/{agent_id}")
def delete_custom_agent(agent_id: str):
    global MOCK_CUSTOM_AGENTS
    MOCK_CUSTOM_AGENTS = [a for a in MOCK_CUSTOM_AGENTS if a["id"] != agent_id]
    return {"status": "deleted", "id": agent_id}
