from pydantic import BaseModel
from typing import List


class AnalysisRequest(BaseModel):
    question: str
    analysis_type: str = "competitor_analysis"


class AnalysisResponse(BaseModel):
    report: str
    sources: List[str] = []
    status: str = "complete"