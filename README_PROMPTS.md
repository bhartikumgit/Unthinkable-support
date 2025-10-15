# LLM Integration Guide

This document details the prompts and configurations used for the AI support bot's Gemini integration.

## System Prompt

```
You are Unthinkable Solution's AI support assistant. First check the FAQ list. If there is a direct FAQ match above threshold, answer with the exact FAQ answer only. If the FAQ match is weak, craft a short friendly answer (max 80 words), provide 1 action suggestion (link or next step), and include a single-line confidence score indicator in JSON at the end of your response in the format: {"confidence": 0.xx}. If you are not confident (<0.45) reply with ESCALATE only. Do not invent policies, dates or prices — always say "Please verify this with our support team" when unsure.
```

## Prompt Components Explained

1. **Role Definition**
   - Establishes identity as Unthinkable Solution's assistant
   - Sets professional but friendly tone

2. **FAQ Priority**
   - Ensures consistent answers for common questions
   - Maintains accuracy for policy-related queries

3. **Response Structure**
   - Max 80 words for clarity
   - Always includes next action step
   - Confidence scoring for transparency

4. **Escalation Criteria**
   - Confidence threshold < 0.45
   - Automatic escalation for policy exceptions
   - Protection against incorrect information

## Confidence Scoring Logic

- 0.9 - 1.0: Direct FAQ match
- 0.7 - 0.9: Strong answer with policy basis
- 0.5 - 0.7: Reasonable answer, some uncertainty
- 0.0 - 0.5: Low confidence, triggers escalation

## Example Interactions

### High Confidence (FAQ Match)
User: "How do I track my order?"
```json
{
  "confidence": 0.95,
  "source": "faq_direct_match",
  "response": "[FAQ: Track Order response]"
}
```

### Medium Confidence (Gemini Generated)
User: "Can I change the shipping address for my order?"
```json
{
  "confidence": 0.65,
  "source": "gemini_generated",
  "response": "You can update the shipping address if your order hasn't been shipped yet. Go to Orders > Find your order > Click 'Update Shipping'. If you don't see this option, please contact support immediately as your order may already be in transit."
}
```

### Low Confidence (Escalation)
User: "My order arrived damaged but it's been 60 days"
```json
{
  "confidence": 0.35,
  "source": "policy_exception",
  "response": "ESCALATE"
}
```

## Implementation Notes

1. **Environment Variables**
   ```
   GEMINI_API_KEY=your_key_here
   LLM_MODE=live  # or 'mock' for testing
   ```

2. **Mock Mode**
   - Uses deterministic responses
   - Maintains same structure
   - Clearly indicates test mode

3. **Error Handling**
   - Retries on API failure
   - Fallback to FAQ-only mode
   - Clear error messaging

4. **Response Processing**
   - Validates JSON structure
   - Sanitizes output
   - Maintains conversation context

## Security Considerations

1. Never expose:
   - Account numbers
   - Personal information
   - Internal policy details

2. Always:
   - Log confidence scores
   - Track escalation reasons
   - Monitor response patterns

## Maintenance

Regular review of:
1. FAQ match thresholds
2. Confidence scoring
3. Escalation triggers
4. Response quality

## Testing

Automated tests check:
1. Response format compliance
2. Confidence score accuracy
3. Escalation triggers
4. FAQ matching logic

## Gemini Model Configuration

The project uses the `gemini-1.5-flash` model, which is optimized for:
- Fast response times
- Consistent output formatting
- Context understanding
- Safety filters

Key configuration settings:
- Temperature: 0.7 (balanced between creativity and consistency)
- Max tokens: 150 (enforces concise responses)
- Retry mechanism: 3 attempts with exponential backoff