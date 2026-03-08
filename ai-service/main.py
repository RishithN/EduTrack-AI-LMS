from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from matching import match_students_to_teachers
from risk_analysis import analyze_student_risk
from recommendation import generate_recommendations
from plagiarism import check_plagiarism

app = FastAPI(title="EduTrack AI Mentorship Service")

class MatchRequest(BaseModel):
    students: List[Dict[str, Any]]
    teachers: List[Dict[str, Any]]

class RiskRequest(BaseModel):
    student_id: str
    attendance_percentage: float
    engagement_score: float
    recent_grades: List[float]

class RecommendationRequest(BaseModel):
    session_notes: str

class PlagiarismRequest(BaseModel):
    text: str

@app.post("/match")
def api_match(request: MatchRequest):
    matches = match_students_to_teachers(request.students, request.teachers)
    return {"matches": matches}

@app.post("/risk")
def api_risk(request: RiskRequest):
    risk_level, predicted_score = analyze_student_risk(
        request.attendance_percentage,
        request.engagement_score,
        request.recent_grades
    )
    return {
        "student_id": request.student_id,
        "risk_level": risk_level,
        "predicted_score": predicted_score
    }

@app.post("/recommendation")
def api_recommendation(request: RecommendationRequest):
    action_items = generate_recommendations(request.session_notes)
    return {"action_items": action_items}

@app.post("/plagiarism")
def api_plagiarism(request: PlagiarismRequest):
    result = check_plagiarism(request.text)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
