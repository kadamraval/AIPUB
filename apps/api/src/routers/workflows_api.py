from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
import uuid

router = APIRouter()

class WorkflowStepDTO(BaseModel):
    step_number: int
    agent_name: str
    type: str  # Data Intake, Agent, Image Tool, Publisher
    description: str

class WorkflowCreate(BaseModel):
    name: str
    description: str
    target_cms: str
    steps: List[WorkflowStepDTO]

MOCK_WORKFLOWS = [
    {
        "id": "wf-1",
        "name": "13-Agent Autonomous Newsroom",
        "description": "Full end-to-end research, keyword clustering, drafting, fal.ai artwork, and WordPress publishing",
        "target_cms": "WordPress",
        "steps": [
            {"step_number": 1, "agent_name": "Data Intake Sources", "type": "Data Intake", "description": "Feeds RSS, Google News & GitHub Streams"},
            {"step_number": 2, "agent_name": "ResearchAgent", "type": "Agent", "description": "Extracts facts & citations from Sources"},
            {"step_number": 3, "agent_name": "Trend & Keyword Agents", "type": "Agent", "description": "Analyzes search volume velocity & clusters"},
            {"step_number": 4, "agent_name": "Writing & Proofread Agents", "type": "Agent", "description": "Drafts article copy matching Website Brand Voice"},
            {"step_number": 5, "agent_name": "SEO Schema Agent", "type": "Agent", "description": "Generates Article & FAQ JSON-LD Schema"},
            {"step_number": 6, "agent_name": "fal.ai ImageAgent", "type": "Image Tool", "description": "Generates 16:9 widescreen featured artwork"},
            {"step_number": 7, "agent_name": "WordPress PublisherAgent", "type": "Publisher", "description": "Posts HTML & media directly to Website Property"}
        ],
        "assigned_websites_count": 2
    },
    {
        "id": "wf-2",
        "name": "fal.ai Visual Product Review Blueprint",
        "description": "Lightweight workflow optimized for visual product breakdowns and Webflow publishing",
        "target_cms": "Webflow",
        "steps": [
            {"step_number": 1, "agent_name": "Data Intake Sources", "type": "Data Intake", "description": "Scrapes product specs & launch notes"},
            {"step_number": 2, "agent_name": "ProductReviewAgent", "type": "Agent", "description": "Drafts pros, cons, and pricing analysis"},
            {"step_number": 3, "agent_name": "fal.ai Flux Image Agent", "type": "Image Tool", "description": "Generates widescreen product mockups via fal.ai"},
            {"step_number": 4, "agent_name": "Webflow Publisher", "type": "Publisher", "description": "Pushes CMS items to Webflow Collection"}
        ],
        "assigned_websites_count": 1
    },
    {
        "id": "wf-3",
        "name": "Multi-Lingual Translation & Shopify Blueprint",
        "description": "Translates blog articles into Spanish/French and publishes to Shopify store",
        "target_cms": "Shopify",
        "steps": [
            {"step_number": 1, "agent_name": "Data Intake Sources", "type": "Data Intake", "description": "Pulls base English articles"},
            {"step_number": 2, "agent_name": "TranslationAgent", "type": "Agent", "description": "Translates content to Spanish and French"},
            {"step_number": 3, "agent_name": "Shopify Publisher", "type": "Publisher", "description": "Publishes to Shopify Store Blog"}
        ],
        "assigned_websites_count": 1
    }
]

@router.get("/")
def get_workflows():
    return MOCK_WORKFLOWS

@router.post("/")
def create_workflow(payload: WorkflowCreate):
    entry = {
        "id": f"wf-{uuid.uuid4().hex[:6]}",
        "name": payload.name,
        "description": payload.description,
        "target_cms": payload.target_cms,
        "steps": [s.model_dump() for s in payload.steps],
        "assigned_websites_count": 0
    }
    MOCK_WORKFLOWS.append(entry)
    return entry

@router.put("/{wf_id}")
def update_workflow(wf_id: str, payload: WorkflowCreate):
    for wf in MOCK_WORKFLOWS:
        if wf["id"] == wf_id:
            wf["name"] = payload.name
            wf["description"] = payload.description
            wf["target_cms"] = payload.target_cms
            wf["steps"] = [s.model_dump() for s in payload.steps]
            return wf
    raise HTTPException(status_code=404, detail="Workflow blueprint not found")

@router.delete("/{wf_id}")
def delete_workflow(wf_id: str):
    global MOCK_WORKFLOWS
    MOCK_WORKFLOWS = [w for w in MOCK_WORKFLOWS if w["id"] != wf_id]
    return {"status": "deleted", "id": wf_id}
