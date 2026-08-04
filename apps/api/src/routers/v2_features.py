from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

@router.get("/video-scripts")
def get_video_scripts():
    return [
        {
            "id": "vs-101",
            "article_title": "The Future of Autonomous AI Agents in Enterprise Software",
            "youtube_duration": "8:30",
            "shorts_duration": "0:58",
            "status": "ready"
        },
        {
            "id": "vs-102",
            "article_title": "Top 10 High-Volume SEO Strategies for 2026 Publishing",
            "youtube_duration": "11:15",
            "shorts_duration": "0:55",
            "status": "ready"
        }
    ]

@router.get("/newsletters")
def get_newsletters():
    return [
        {
            "id": "nl-201",
            "subject": "🔥 New Deep Dive: Autonomous AI Agents in Enterprise",
            "subscribers_count": 14200,
            "status": "scheduled",
            "send_date": "2026-07-29 09:00"
        }
    ]

@router.get("/ab-tests")
def get_ab_tests():
    return [
        {
            "id": "ab-301",
            "article_title": "The Future of Autonomous AI Agents in Enterprise Software",
            "variant_a_ctr": "4.2%",
            "variant_b_ctr": "6.8%",
            "winning_variant": "Variant B: 10 Ways AI Agents Will Transform Enterprise Content",
            "confidence": "98.4%"
        }
    ]

@router.get("/content-refresh")
def get_content_refreshes():
    return [
        {
            "id": "cr-401",
            "article_title": "2025 Guide to WordPress REST API Automation",
            "previous_rank": 2,
            "current_rank": 6,
            "decay": 4,
            "auto_refresh_status": "refresh_queued"
        }
    ]
