const aiService = require('../services/aiService');

exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }
    const response = await aiService.getResponse(message, context || {});
    res.json({ success: true, response });
  } catch (error) {
    console.error('AI chat error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get AI response' });
  }
};

exports.clearHistory = async (req, res) => {
  aiService.clearHistory();
  res.json({ success: true, message: 'Conversation history cleared' });
};
