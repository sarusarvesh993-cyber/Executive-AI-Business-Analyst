import os
from dotenv import load_dotenv
from openai import OpenAI

from tools import gather_business_context

load_dotenv()


def get_secret(name: str, default=None):
    value = os.getenv(name)

    if value:
        return value

    return default


OPENROUTER_API_KEY = get_secret("OPENROUTER_API_KEY")
OPENROUTER_MODEL = get_secret("OPENROUTER_MODEL", "openai/gpt-4o-mini")


def get_client():
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY not found in backend .env file.")

    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
        default_headers={
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Executive AI Business Analyst",
        },
    )


def generate_business_report(question: str, analysis_type: str):
    """
    Controlled multi-agent style business analysis workflow.
    """

    context, sources = gather_business_context(question, analysis_type)

    client = get_client()

    system_prompt = """
You are an expert multi-agent business analyst system.

You simulate the work of multiple expert agents:
1. Research Agent
2. Market Analyst Agent
3. Competitor Analyst Agent
4. SWOT Analyst Agent
5. Strategy Advisor Agent
6. Executive Report Writer Agent

Your job is to create an executive-quality business analysis report.

Rules:
- Use only the provided research context.
- Do not invent exact financial numbers if not present.
- Cite source URLs where useful.
- Use cautious language when information is based on snippets.
- Clearly mention what could not be verified.
- Write in a professional consulting-style tone.
- Use markdown.
"""

    user_prompt = f"""
Business Question:
{question}

Analysis Type:
{analysis_type}

Research Context:
{context}

Create a business analysis report in this exact structure:

# Executive Business Analysis Report

## Executive Summary
- 3 to 5 high-impact bullets.

## Market Context
Explain the market or industry context.

## Company / Competitor Overview
Explain the main companies, players, or business entities involved.

## Competitor Comparison Table
Create a markdown table comparing key dimensions such as:
- Business model
- Strengths
- Weaknesses
- Growth drivers
- Risks

## SWOT Analysis
Create a SWOT analysis with:
- Strengths
- Weaknesses
- Opportunities
- Threats

## Key Risks
List major business, market, competitive, regulatory, or execution risks.

## Opportunities
List strategic growth opportunities.

## Strategic Recommendations
Give 5 practical executive-level recommendations.

## Sources
List source URLs used.

## What Could Not Be Verified
Mention missing, uncertain, or not directly verified information.
"""

    response = client.chat.completions.create(
        model=OPENROUTER_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )

    report = response.choices[0].message.content or "No report generated."

    return report, sources