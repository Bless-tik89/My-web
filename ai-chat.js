// netlify/functions/chatbot.js
exports.handler = async (event) => {
  console.log('Function started');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userMessage } = JSON.parse(event.body);
    console.log('User message:', userMessage);

    const HF_API_KEY = process.env.HF_API_KEY;
    console.log('API Key exists:', !!HF_API_KEY);
    
    const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1';

    const prompt = `<s>[INST] You are a helpful, friendly customer service assistant for a clothing store. Answer the customer's question politely and helpfully in one short sentence. Customer's question: "${userMessage}" Your helpful response: [/INST]`;

    console.log('Calling Hugging Face API...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', JSON.stringify(data).substring(0, 200));
    
    const generatedText = data[0]?.generated_text || '';
    const aiResponse = generatedText.split('[/INST]')[1]?.trim() || "I'm sorry, I didn't understand that.";

    console.log('Final response:', aiResponse);
    return {
      statusCode: 200,
      body: JSON.stringify({ aiResponse })
    };

  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response from AI: ' + error.message })
    };
  }
};
