def match_students_to_teachers(students, teachers):
    """
    Intelligently match students with teachers based on subject expertise,
    student weak areas, teacher workload, and historical improvement metrics
    using a weighted matching algorithm.
    """
    matches = []
    
    # Sort teachers by current workload (ascending)
    # Mocking that logic by just taking the teachers list and assigning.
    teachers_workload = {t['id']: t.get('workload', 0) for t in teachers}
    
    for student in students:
        best_teacher = None
        best_score = -1
        
        for teacher in teachers:
            score = 0
            
            # Match weak subjects to teacher expertise
            if set(student.get('weak_subjects', [])).intersection(set(teacher.get('expertise', []))):
                score += 50
                
            # Penalize high workload
            score -= (teachers_workload[teacher['id']] * 5)
            
            # Historical improvement metrics (mocking a bonus)
            score += teacher.get('historical_success_rate', 0.5) * 20
            
            if score > best_score:
                best_score = score
                best_teacher = teacher
                
        if best_teacher:
            matches.append({
                "student_id": student['id'],
                "teacher_id": best_teacher['id'],
                "match_score": best_score
            })
            teachers_workload[best_teacher['id']] += 1
            
    return matches
