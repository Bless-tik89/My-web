// netlify/functions/chatbot.js
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the user's message from the request body
    const { userMessage } = JSON.parse(event.body);

    // Your Hugging Face API key - from Netlify's environment variable
    const HF_API_KEY = process.env.HF_API_KEY;
    const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

    // Prepare the prompt for the AI
    const prompt = `<s>[INST] You are a helpful, friendly customer service assistant for a clothing store. Answer the customer's question politely and helpfully in one short sentence. Customer's question: "${userMessage}" Your helpful response: [/INST]`;

    // Call the Hugging Face API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the generated text from the response
    const generatedText = data[0]?.generated_text || '';
    // Extract just the assistant's response
    const aiResponse = generatedText.split('[/INST]')[1]?.trim() || "I'm sorry, I didn't understand that.";

    // Return the AI's response to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ aiResponse })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response from AI' })
    };
  }
};
