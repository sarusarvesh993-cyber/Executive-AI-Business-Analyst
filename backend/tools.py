import time
from urllib.parse import urlparse

import requests
import trafilatura
from ddgs import DDGS


BLOCKED_DOMAINS = [
    "wikipedia.org",
    "quora.com",
    "reddit.com",
    "pinterest.com",
]

PREFERRED_DOMAINS = [
    "economictimes.indiatimes.com",
    "business-standard.com",
    "livemint.com",
    "moneycontrol.com",
    "forbes.com",
    "mckinsey.com",
    "bcg.com",
    "bain.com",
    "deloitte.com",
    "pwc.com",
    "kpmg.com",
    "statista.com",
    "ibef.org",
    "nasscom.in",
    "company website",
]


def get_domain(url: str) -> str:
    try:
        return urlparse(url).netloc.lower().replace("www.", "")
    except Exception:
        return ""


def is_blocked_url(url: str) -> bool:
    domain = get_domain(url)
    return any(blocked in domain for blocked in BLOCKED_DOMAINS)


def is_preferred_url(url: str) -> bool:
    domain = get_domain(url)
    return any(preferred in domain for preferred in PREFERRED_DOMAINS)


def build_business_search_queries(question: str, analysis_type: str) -> list[str]:
    """
    Build targeted business search queries.
    """
    base = question.strip()

    if analysis_type == "competitor_analysis":
        return [
            f"{base} market share business analysis",
            f"{base} revenue growth competition strategy",
            f"{base} latest news market trends",
            f"{base} SWOT analysis",
        ]

    if analysis_type == "market_research":
        return [
            f"{base} market size growth trends",
            f"{base} industry report India global",
            f"{base} key players opportunities risks",
        ]

    if analysis_type == "company_analysis":
        return [
            f"{base} company overview revenue strategy",
            f"{base} recent news business model",
            f"{base} competitors SWOT",
        ]

    return [
        f"{base} business analysis",
        f"{base} market trends",
        f"{base} competitors risks opportunities",
    ]


def search_web(query: str, max_results: int = 5) -> list[dict]:
    """
    Search web and return structured results.
    """
    results_list = []
    seen_urls = set()

    try:
        with DDGS() as ddgs:
            results = list(
                ddgs.text(
                    query,
                    region="wt-wt",
                    safesearch="moderate",
                    max_results=max_results,
                )
            )

        for result in results:
            title = result.get("title", "No title")
            url = result.get("href", "")
            snippet = result.get("body", "No snippet")

            if not url or url in seen_urls:
                continue

            if is_blocked_url(url):
                continue

            seen_urls.add(url)

            results_list.append(
                {
                    "title": title,
                    "url": url,
                    "snippet": snippet,
                    "preferred": is_preferred_url(url),
                }
            )

    except Exception:
        pass

    return sorted(results_list, key=lambda x: x["preferred"], reverse=True)


def fetch_page(url: str) -> str:
    """
    Fetch webpage and extract clean text.
    """
    try:
        response = requests.get(
            url,
            timeout=12,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 Chrome/120 Safari/537.36"
                )
            },
        )

        if response.status_code != 200:
            return ""

        text = trafilatura.extract(
            response.text,
            include_comments=False,
            include_tables=True,
        )

        if not text:
            return ""

        return text[:4000]

    except Exception:
        return ""


def gather_business_context(question: str, analysis_type: str, max_sources: int = 6):
    """
    Search and fetch business context.
    Returns context text and source URLs.
    """
    queries = build_business_search_queries(question, analysis_type)

    all_results = []
    seen_urls = set()

    for query in queries[:3]:
        search_results = search_web(query, max_results=5)

        for result in search_results:
            url = result["url"]

            if url in seen_urls:
                continue

            seen_urls.add(url)
            result["query"] = query
            all_results.append(result)

        time.sleep(0.5)

    all_results = all_results[:max_sources]

    context_blocks = []
    sources = []

    for idx, result in enumerate(all_results, start=1):
        url = result["url"]
        sources.append(url)

        page_text = fetch_page(url)

        block = f"""
SOURCE {idx}
Search Query: {result.get("query")}
Title: {result.get("title")}
URL: {url}
Snippet: {result.get("snippet")}
"""

        if page_text:
            block += f"""
Fetched Content:
{page_text}
"""
        else:
            block += """
Fetched Content:
Could not fully fetch this page. Use title, URL, and snippet only.
"""

        context_blocks.append(block)

    if not context_blocks:
        return "No useful web context found.", []

    return "\n\n====================\n\n".join(context_blocks), sources