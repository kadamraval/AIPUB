try:
    import httpx
except ImportError:
    httpx = None

from typing import Dict, Any, Optional

class FreepikMCPTool:
    """
    Connects to Freepik MCP API to generate high-resolution visual assets.
    """
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or "fpsk-default-demo-key"
        self.base_url = "https://api.freepik.com/v1/ai/text-to-image"

    async def generate_image(self, prompt: str, aspect_ratio: str = "widescreen") -> Dict[str, Any]:
        if not httpx:
            return {
                "status": "fallback",
                "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
                "provider": "Freepik MCP (Fallback)"
            }

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-freepik-api-key": self.api_key
        }
        payload = {
            "prompt": prompt,
            "num_images": 1,
            "image": {"size": aspect_ratio}
        }
        
        async with httpx.AsyncClient(timeout=45.0) as client:
            try:
                response = await client.post(self.base_url, json=payload, headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    image_url = data["data"][0]["base64"] if "base64" in data["data"][0] else data["data"][0].get("url")
                    return {
                        "status": "success",
                        "image_url": image_url or "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
                        "provider": "Freepik MCP"
                    }
                else:
                    return {
                        "status": "fallback",
                        "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
                        "provider": "Freepik MCP (Fallback)"
                    }
            except Exception as e:
                return {
                    "status": "fallback",
                    "error": str(e),
                    "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
                    "provider": "Freepik MCP (Fallback)"
                }
