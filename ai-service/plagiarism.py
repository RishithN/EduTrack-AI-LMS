import os
import re
import urllib.request
import urllib.parse
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from collections import Counter

# --- Mock Database of Existing Academic Papers / Submissions ---
MOCK_CORPUS = {
    "doc1": "React is a free and open-source front-end JavaScript library for building user interfaces based on components. It is maintained by Meta and a community of individual developers.",
    "doc2": "Machine learning is a field of study in artificial intelligence concerned with the development and study of statistical algorithms that can learn from data and generalize to unseen data.",
    "doc3": "Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs on the V8 JavaScript engine.",
    "doc4": "The TF-IDF algorithm is used to determine how important a word is to a document in a collection or corpus. It increases proportionally to the number of times a word appears in the document.",
}

STOP_WORDS = set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"
])

def clean_text(text: str) -> str:
    """Preprocess text by lowercasing and removing special characters."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    return text

def extract_top_keywords(text: str, top_n: int = 3) -> list:
    """Extract top frequent non-stop words to formulate a search query."""
    words = clean_text(text).split()
    valid_words = [w for w in words if w not in STOP_WORDS and len(w) > 3]
    if not valid_words:
        return []
    most_common = Counter(valid_words).most_common(top_n)
    return [word for word, count in most_common]

def fetch_wikipedia_summaries(query: str, limit: int = 3) -> dict:
    """Fetches text extracts from Wikipedia based on a search query."""
    results = {}
    try:
        url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&utf8=&format=json&srlimit={limit}"
        req = urllib.request.Request(url, headers={'User-Agent': 'EduTrackBot/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            if not data.get('query', {}).get('search'):
                return results
                
            for item in data['query']['search']:
                pageid = item['pageid']
                title = item['title']
                
                url2 = f"https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&pageids={pageid}&format=json"
                req2 = urllib.request.Request(url2, headers={'User-Agent': 'EduTrackBot/1.0'})
                with urllib.request.urlopen(req2, timeout=5) as response2:
                    data2 = json.loads(response2.read().decode())
                    extract = data2['query']['pages'][str(pageid)].get('extract', '')
                    if extract:
                        results[f"Wikipedia: {title}"] = extract
    except Exception as e:
        print(f"Wikipedia fetch error: {e}")
    return results

def check_plagiarism(uploaded_text: str) -> dict:
    """
    Checks the uploaded text against both a static mock corpus and dynamically
    fetched Wikipedia articles based on the document's top keywords.
    """
    if not uploaded_text or not uploaded_text.strip():
        return {
            "overall_score": 0.0,
            "is_plagiarized": False,
            "matches": []
        }

    # 1. Build the dynamic corpus
    keywords = extract_top_keywords(uploaded_text)
    dynamic_corpus = MOCK_CORPUS.copy()
    
    if keywords:
        search_query = " ".join(keywords)
        wiki_results = fetch_wikipedia_summaries(search_query)
        dynamic_corpus.update(wiki_results)
        
    documents = [uploaded_text] + list(dynamic_corpus.values())
    doc_ids = ["uploaded"] + list(dynamic_corpus.keys())
    
    # 2. Calculate TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english', preprocessor=clean_text)
    
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        similarity_scores = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    except ValueError:
        return {"overall_score": 0.0, "is_plagiarized": False, "matches": []}
        
    matches = []
    
    # Simple chunking of the uploaded text into sentences to find specific matches
    sentences = re.split(r'(?<=[.!?]) +', uploaded_text)
    valid_sentences = [s for s in sentences if len(s.split()) >= 4]
    
    max_score = 0.0
    
    for idx, score in enumerate(similarity_scores):
        if score > 0.1: # lower threshold from 0.05 to catch more nuances, wait 0.1 is fine
            max_score = max(max_score, score)
            source_id = doc_ids[idx + 1]
            corpus_text = dynamic_corpus[source_id]
            
            matched_sentences = []
            
            if valid_sentences:
                sent_vectorizer = TfidfVectorizer(stop_words='english', preprocessor=clean_text)
                try:
                    sent_matrix = sent_vectorizer.fit_transform(valid_sentences + [corpus_text])
                    sent_scores = cosine_similarity(sent_matrix[:-1], sent_matrix[-1:]).flatten()
                    
                    for i, s_score in enumerate(sent_scores):
                        if s_score > 0.35: # Require stronger sentence match
                            matched_sentences.append(valid_sentences[i])
                except ValueError:
                    pass
            
            # Use 0.15 threshold for general document match
            if matched_sentences or score > 0.15:
                # Add highlighting constraint
                matches.append({
                    "source": source_id if "Wikipedia" in source_id else f"Internal Database ({source_id})",
                    "similarity": round(score * 100, 1),
                    "matched_text": matched_sentences[:5] if matched_sentences else ["Overall conceptual overlap detected based on document vectors."]
                })
                
    overall_percentage = round(max_score * 100, 1)

    return {
        "overall_score": float(overall_percentage),
        "is_plagiarized": bool(overall_percentage > 25.0),
        "matches": sorted(matches, key=lambda x: x["similarity"], reverse=True)
    }
