import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  confidence?: number;
}

export interface ChatResponse {
  response: string;
  confidence: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createSession = async (): Promise<{ id: string }> => {
  try {
    console.log('Creating new session...');
    const response = await api.post('/session');
    console.log('Session created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export interface SendMessageParams {
  session_id: string;
  message: string;
  category?: string;
  subtopic?: string;
}

export const sendMessage = async (params: SendMessageParams): Promise<Message> => {
  try {
    console.log('Sending chat message:', params);
    const response = await api.post<ChatResponse>('/chat', params);
    console.log('Chat response received:', response.data);
    
    if (!response.data || !response.data.response) {
      throw new Error('Invalid response from server');
    }

    // Handle potential escalation or error responses
    if (response.data.response === 'ESCALATE') {
      return {
        id: Date.now().toString(),
        content: 'I need to escalate this to our support team. Would you like me to create a ticket?',
        role: 'assistant',
        timestamp: new Date().toISOString(),
        confidence: response.data.confidence || 0,
      };
    }
    
    return {
      id: Date.now().toString(),
      content: response.data.response,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      confidence: response.data.confidence,
    };
  } catch (error: any) {
    console.error('Error sending chat message:', error);
    // Return a user-friendly error message
    return {
      id: Date.now().toString(),
      content: error.response?.data?.detail || 'Sorry, I encountered an error. Please try again.',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      confidence: 0,
    };
  }
};

export const createEscalation = async (sessionId: string, issue: string) => {
  try {
    console.log('Creating escalation:', { sessionId, issue });
    const response = await api.post('/escalate', {
      session_id: sessionId,
      issue,
    });
    console.log('Escalation created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating escalation:', error);
    throw error;
  }
};

const chatApi = {
  createSession,
  sendMessage,
  createEscalation,
};

export default chatApi;