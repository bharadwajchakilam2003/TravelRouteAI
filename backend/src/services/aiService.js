const axios = require('axios');
const config = require('../config/env');

class AITravelAssistant {
  constructor() {
    this.conversationHistory = [];
  }

  async getResponse(userMessage, context = {}) {
    this.conversationHistory.push({ role: 'user', content: userMessage });
    try {
      if (config.geminiApiKey && config.geminiApiKey !== 'your_gemini_api_key') {
        return await this._getGeminiResponse(userMessage, context);
      }
      return this._getRuleBasedResponse(userMessage, context);
    } catch (error) {
      console.error('AI service error:', error.message);
      return this._getRuleBasedResponse(userMessage, context);
    }
  }

  async _getGeminiResponse(message, context) {
    const systemPrompt = this._buildSystemPrompt(context);
    const history = this.conversationHistory.slice(-10).map(m => m.content).join('\n');
    const fullPrompt = `${systemPrompt}\n\nConversation:\n${history}\n\nUser: ${message}\n\nAssistant:`;
    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiApiKey}`,
      { contents: [{ parts: [{ text: fullPrompt }] }] },
      { timeout: 15000 }
    );
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, I could not generate a response.';
    this.conversationHistory.push({ role: 'assistant', content: reply });
    return reply;
  }

  _buildSystemPrompt(context) {
    let prompt = 'You are TravelRoute AI, a helpful travel planning assistant for Indian travel. Provide concise, practical travel advice in simple language.';
    if (context.source && context.destination) {
      prompt += `\nCurrent trip: From ${context.source} to ${context.destination}`;
    }
    if (context.distance) {
      prompt += `\nDistance: ${context.distance} km`;
    }
    prompt += '\nAnswer questions about: tourist places, weather, travel costs (car/bus/train/flight), hotels, restaurants, and travel tips. Be friendly and informative. Keep responses under 100 words.';
    return prompt;
  }

  _getRuleBasedResponse(message, context) {
    const lower = message.toLowerCase();
    const { source, destination } = context;
    const msg = `${source || 'your source'} to ${destination || 'your destination'}`;

    if (!context.source && !context.destination) {
      return 'Please search for a route first by entering your source and destination locations. I can then help you with specific travel information!';
    }

    if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey')) {
      return `Hello! I'm TravelRoute AI. I can help with attractions, weather, costs, hotels, restaurants, and travel tips for your trip from ${msg}. How can I assist you today?`;
    }
    if (lower.includes('place') || lower.includes('attraction') || lower.includes('visit') || lower.includes('see') || lower.includes('tourist')) {
      return `Popular attractions between ${msg}: I recommend checking temples, forts, museums, parks, and viewpoints along the route. Check the Attractions section for detailed info with ratings and images. Some must-visits include iconic monuments, cultural centers, and natural wonders.`;
    }
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('temperature') || lower.includes('climate') || lower.includes('safe')) {
      return `For weather between ${msg}: Check the Weather Forecast section for temperature, humidity, wind speed, and rain probability. October to March offers pleasant weather in most of India. Monsoon (June-September) may cause delays. Check real-time forecasts before departing.`;
    }
    if (lower.includes('cost') || lower.includes('cheap') || lower.includes('budget') || lower.includes('cheapest') || lower.includes('price') || lower.includes('fare')) {
      return `Travel costs from ${msg}: Car fuel cost is approx ₹${context.distance ? Math.round(context.distance / 15 * 110) : '~'} + tolls. Bus: ₹${context.distance ? Math.round(context.distance * 1.5) : '~'} (govt) to ₹${context.distance ? Math.round(context.distance * 2) : '~'} (private). Train fares vary by class (Sleeper/3A/2A/1A). Flights are fastest but cost more. Check the Cost Comparison section.`;
    }
    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('accommodation') || lower.includes('room')) {
      return `For accommodation between ${msg}: Options range from budget (₹1,000-2,000/night) to luxury (₹5,000+/night). Look for hotels with good ratings, WiFi, breakfast, and parking. Popular booking platforms include Oyo, MakeMyTrip, and Goibibo.`;
    }
    if (lower.includes('food') || lower.includes('restaurant') || lower.includes('eat') || lower.includes('cuisine') || lower.includes('dining')) {
      return `For dining between ${msg}: Check the Restaurants section for local cuisine, ratings, and cost for two. Try highway dhabas for authentic local food, restaurant chains for reliable quality, and local eateries for regional specialties.`;
    }
    if (lower.includes('train') || lower.includes('railway') || lower.includes('irctc')) {
      return `For trains between ${msg}: Check available trains, timings, and fare classes (General, Sleeper, 3A, 2A, 1A). Book via IRCTC for confirmed tickets. Train prices shown are estimates and may vary from official IRCTC fares.`;
    }
    if (lower.includes('flight') || lower.includes('plane') || lower.includes('airline')) {
      return `For flights between ${msg}: Check the Flight section for cheapest and fastest options. Book 4-6 weeks in advance for best fares. Early morning and late night flights are often cheaper.`;
    }
    if (lower.includes('bus') || lower.includes('redbus') || lower.includes('coach')) {
      return `For bus travel between ${msg}: Government buses (₹${context.distance ? Math.round(context.distance * 1.5) : '~'}) and private AC sleeper buses (₹${context.distance ? Math.round(context.distance * 2) : '~'}) are available. Book via RedBus or directly with operators.`;
    }
    if (lower.includes('car') || lower.includes('drive') || lower.includes('road trip') || lower.includes('toll')) {
      return `For road travel between ${msg}: Distance is ${context.distance || '~'} km taking about ${context.distance ? Math.round(context.distance / 50) : '~'} hours. Fuel cost: ₹${context.distance ? Math.round(context.distance / 15 * 110) : '~'}. Take breaks every 3-4 hours and check for rest stops.`;
    }
    if (lower.includes('time') || lower.includes('duration') || lower.includes('how long') || lower.includes('reach')) {
      return `Travel time from ${msg}: By car: ${context.distance ? Math.round(context.distance / 50) : '~'} hours. By train: varies by class. By flight: 1-2 hours + airport time. By bus: ${context.distance ? Math.round(context.distance / 40) : '~'} hours.`;
    }
    if (lower.includes('thanks') || lower.includes('thank')) {
      return 'You\'re welcome! I hope you have a wonderful trip. Safe travels!';
    }
    return `I can help you plan your trip from ${msg}! Ask me about: attractions, weather, costs, hotels, restaurants, trains, flights, buses, car travel, and travel time. What would you like to know?`;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

module.exports = new AITravelAssistant();
