from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import websites, articles, agents, v2_features, v3_features, api_keys, integrations, custom_agents_api, sources, workflows_api

app = FastAPI(
    title="AI Publishing OS - Core API",
    description="Autonomous Multi-Tenant AI Publishing Platform API (Custom Workflows & Agent Blueprints)",
    version="3.4.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "system": "AI Publishing OS API",
        "status": "online",
        "version": "3.4.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(websites.router, prefix="/api/v1/websites", tags=["Websites"])
app.include_router(workflows_api.router, prefix="/api/v1/workflows", tags=["Custom Workflows"])
app.include_router(articles.router, prefix="/api/v1/articles", tags=["Articles"])
app.include_router(sources.router, prefix="/api/v1/sources", tags=["Data Sources"])
app.include_router(integrations.router, prefix="/api/v1/integrations", tags=["Integrations Hub"])
app.include_router(custom_agents_api.router, prefix="/api/v1/custom-agents", tags=["Custom Agents & Skills"])
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents Engine"])
app.include_router(v2_features.router, prefix="/api/v1/v2", tags=["V2 Features"])
app.include_router(v3_features.router, prefix="/api/v1/v3", tags=["V3 Enterprise"])
