import re

def generate_recommendations(session_notes: str) -> list[str]:
    """
    Generates personalized study plans and action items from session notes.
    """
    action_items = []
    
    # Simple heuristic for keyword extraction
    keywords = ['study', 'practice', 'focus', 'read', 'revise', 'complete', 'review']
    
    sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', session_notes)
    
    for sentence in sentences:
        if any(keyword in sentence.lower() for keyword in keywords):
            action_items.append(sentence.strip())
            
    # Default message if nothing found
    if not action_items:
        action_items = ["Review the topics discussed in the session.", "Prepare questions for the next session."]
        
    return action_items
