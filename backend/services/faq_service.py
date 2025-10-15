import json
from pathlib import Path
from thefuzz import fuzz
from typing import Dict, List, Tuple

class FAQService:
    def __init__(self):
        self.faqs = self._load_faqs()
        self.questions = self._extract_questions()

    def _load_faqs(self) -> Dict:
        faq_path = Path(__file__).parent.parent.parent / 'data' / 'faqs.json'
        with open(faq_path, 'r') as f:
            return json.load(f)

    def _extract_questions(self) -> List[Tuple[str, str, float]]:
        questions = []
        for category in self.faqs['categories'].values():
            for sub_option, data in category['suboptions'].items():
                questions.append((
                    data['question'],
                    data['answer'],
                    data.get('confidence_threshold', 0.8)
                ))
        return questions

    def search(self, query: str) -> Tuple[str, float]:
        best_match = None
        best_score = 0
        best_threshold = 0.8

        # Try exact matches first
        for question, answer, threshold in self.questions:
            if query.lower() == question.lower():
                return answer, 1.0

        # Then try fuzzy matching
        for question, answer, threshold in self.questions:
            # Use token sort ratio to handle word order differences
            score = fuzz.token_sort_ratio(query.lower(), question.lower()) / 100.0
            
            if score > best_score:
                best_score = score
                best_match = answer
                best_threshold = threshold

        if best_score >= best_threshold:
            return best_match, best_score
        
        return None, best_score

faq_service = FAQService()
