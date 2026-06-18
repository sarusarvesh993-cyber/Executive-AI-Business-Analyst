from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import AnalysisRequest, AnalysisResponse
from agents import generate_business_report


app = FastAPI(
    title="Executive AI Business Analyst API",
    description="FastAPI backend for AI business analysis reports",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Executive AI Business Analyst API is running",
        "status": "ok",
    }


@app.post("/analyze", response_model=AnalysisResponse)
def analyze_business(request: AnalysisRequest):
    try:
        if not request.question.strip():
            raise HTTPException(status_code=400, detail="Question is required.")

        report, sources = generate_business_report(
            question=request.question,
            analysis_type=request.analysis_type,
        )

        return AnalysisResponse(
            report=report,
            sources=sources,
            status="complete",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))