def analyze_student_risk(attendance_percentage: float, engagement_score: float, recent_grades: list[float]) -> tuple[str, float]:
    """
    Detects at-risk students, predicts upcoming performance, identify engagement drops.
    Returns: (Risk Indicator [Green/Yellow/Red], Predicted Score)
    """
    # Simple heuristic/mock ML logic
    if not recent_grades:
        avg_grade = 50.0 
    else:
        avg_grade = sum(recent_grades) / len(recent_grades)
        
    # Regression dummy logic for prediction
    predicted_score = (avg_grade * 0.5) + (attendance_percentage * 0.3) + (engagement_score * 0.2 * 10)
    
    # Classification dummy logic for risk
    if predicted_score >= 75 and attendance_percentage > 80:
        risk_level = "Green"
    elif predicted_score >= 50 and attendance_percentage > 60:
        risk_level = "Yellow"
    else:
        risk_level = "Red"
        
    return risk_level, round(predicted_score, 2)
