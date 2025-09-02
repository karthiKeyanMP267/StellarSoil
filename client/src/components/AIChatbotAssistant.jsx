import React from 'react';
import AISmartChatbot from './AISmartChatbot';

const AIChatbotAssistant = ({ userId, userRole = 'customer' }) => {
  return <AISmartChatbot userRole={userRole} />;
};

export default AIChatbotAssistant;
