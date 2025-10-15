import { Message } from '../api/client';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const getConfidenceClass = (confidence?: number) => {
    if (!confidence) return '';
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.45) return 'confidence-medium';
    return 'confidence-low';
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className={`flex flex-col ${
        message.role === 'user' ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={
          message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
        }
      >
        {message.content}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-muted">
          {formatTime(message.timestamp)}
        </span>
        {message.role === 'assistant' && message.confidence && (
          <div className="flex-1 max-w-[100px]">
            <div
              className={`confidence-meter ${getConfidenceClass(
                message.confidence
              )}`}
              style={{ width: `${message.confidence * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
