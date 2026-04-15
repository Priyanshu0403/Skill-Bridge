import axios from 'axios';
import supabase from '../utils/supabase.js';

const CHAT_SERVICE_URL = 'http://localhost:5001/api/chat';

export const sendChatMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.user.id;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email, college, year, skills, bio')
      .eq('user_id', userId)
      .single();

    if (profileError) throw profileError;

    const response = await axios.post(
      CHAT_SERVICE_URL,
      {
        message,
        history: Array.isArray(history) ? history.slice(-6) : [],
        profile: profile || {},
      },
      { timeout: 10000 }
    );

    res.json({
      success: true,
      reply: response.data?.reply || 'I could not generate a response right now.',
      suggestions: Array.isArray(response.data?.suggestions) ? response.data.suggestions : [],
      topic: response.data?.topic || 'general',
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED' ? 503 : 502;
      return res.status(status).json({
        success: false,
        message: 'Chat service is unavailable right now',
      });
    }

    res.status(500).json({ success: false, message: error.message });
  }
};
