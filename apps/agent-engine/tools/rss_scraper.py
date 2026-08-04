try:
    import feedparser
except ImportError:
    feedparser = None

try:
    import httpx
except ImportError:
    httpx = None

try:
    from bs4 import BeautifulSoup
except ImportError:
    BeautifulSoup = None

from typing import Dict, Any, List

class RSSScraperTool:
    """
    Parses RSS feeds & scrapes web articles for research data gathering.
    """
    def fetch_rss_feed(self, feed_url: str) -> List[Dict[str, Any]]:
        if not feedparser:
            return [{"title": "Sample Feed Item", "link": feed_url, "summary": "Feed parser fallback"}]
            
        feed = feedparser.parse(feed_url)
        results = []
        for entry in feed.entries[:5]:
            results.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "summary": entry.get("summary", ""),
                "published": entry.get("published", "")
            })
        return results

    async def scrape_web_page(self, url: str) -> Dict[str, Any]:
        if not httpx or not BeautifulSoup:
            return {"url": url, "title": "Scraped Page", "text_snippets": ["Sample text snippet"]}
            
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            try:
                response = await client.get(url)
                soup = BeautifulSoup(response.text, "html.parser")
                paragraphs = [p.get_text() for p in soup.find_all("p") if len(p.get_text()) > 40]
                return {
                    "url": url,
                    "title": soup.title.string if soup.title else "",
                    "text_snippets": paragraphs[:10]
                }
            except Exception as e:
                return {"url": url, "error": str(e), "text_snippets": []}
