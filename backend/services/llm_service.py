import os
import google.generativeai as genai
import logging
import json
from typing import Tuple

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        logger.info(f"Using API key: {self.api_key}")
        if not self.api_key:
            logger.warning("GEMINI_API_KEY not set. Using mock responses.")
        
        genai.configure(api_key=self.api_key)
        try:
            self.model = genai.GenerativeModel("gemini-pro")
            logger.info("Gemini model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {str(e)}", exc_info=True)
            self.model = None

    async def get_response(self, message: str, context: str = "") -> Tuple[str, float]:
        """
        Generate AI response using Gemini model.
        Returns a tuple of (response_text, confidence_score)
        """
        try:
            # Construct the prompt
            prompt = f"""You are Unthinkable Solution's AI support assistant. You must always provide a helpful response.

            Previous context: {context}
            User question: {message}

            Instructions for response:
            1. Always provide a direct, helpful answer
            2. Be friendly and professional
            3. For technical issues, provide step-by-step solutions
            4. For account/billing issues, provide clear process steps
            5. Include specific next steps or recommendations
            6. Keep responses concise but informative
            7. End with confidence score in JSON format: {{"confidence": 0.95}}

            Remember: You must always provide a helpful response, never say you can't help."""

            # Generate response
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 150,
            }

            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
            ]

            logger.info(f"Sending prompt to Gemini: {prompt}")
            try:
                logger.info("Attempting Gemini API call with config: %s", generation_config)
                response = await self.model.generate_content_async(
                    prompt,
                    generation_config=generation_config,
                    safety_settings=safety_settings
                )
                if not response:
                    logger.error("Gemini API returned None response")
                    raise Exception("Empty response from Gemini API")
                    
                logger.info(f"Response object type: {type(response)}")
                logger.info(f"Response object attributes: {dir(response)}")
                
                response_text = response.text.strip() if hasattr(response, 'text') else str(response)
                logger.info(f"Raw Gemini response: {response_text}")
            except Exception as e:
                logger.error(f"Error during Gemini API call: {str(e)}", exc_info=True)
                logger.error(f"Error type: {type(e)}")
                logger.error(f"Error class: {e.__class__.__name__}")
                raise
            
            # Handle potential safety blocks or empty responses
            if not response_text:
                return "I apologize, but I cannot provide a response to that query.", 0.0
                
            # Extract confidence score if present
            confidence = 0.5  # Default confidence
            if '{"confidence":' in response_text:
                try:
                    confidence_str = response_text[response_text.rindex("{"):].strip()
                    confidence = float(confidence_str.split(":")[1].strip("} "))
                    response_text = response_text[:response_text.rindex("{")].strip()
                except:
                    pass

            return response_text, confidence

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            return "I apologize, but I'm having trouble processing your request right now. Please try again.", 0.0

    def _generate_default_response(self, query: str) -> Tuple[str, float]:
        """Generate a helpful response based on query type."""
        query_lower = query.lower()
        
        if "browser" in query_lower or "technical" in query_lower:
            return "Here are the steps to resolve common browser issues:\n1. Clear browser cache and cookies\n2. Update your browser to the latest version\n3. Disable extensions temporarily\n4. Try incognito/private mode\n\nIf issues persist, try using a different browser.", 0.95
        elif "account" in query_lower or "email" in query_lower:
            return "To update your account settings:\n1. Go to Account Settings\n2. Select the field you want to update\n3. Enter new information\n4. Click Save Changes\n\nFor security, you may need to verify your identity.", 0.95
        elif "payment" in query_lower or "billing" in query_lower:
            return "For billing questions:\n1. Check your billing history in Account > Billing\n2. Verify payment method details\n3. Contact billing support with your account ID\n\nWe're here to help with any specific concerns.", 0.95
        else:
            return "I understand your question about " + query + ". Let me help:\n1. First, could you specify which part you need help with?\n2. This will help me provide more specific guidance.\n3. I'm here to assist with any follow-up questions.", 0.95

llm_service = LLMService()