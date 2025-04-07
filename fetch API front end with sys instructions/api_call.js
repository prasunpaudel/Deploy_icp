 import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from 'https://cdn.jsdelivr.net/npm/@google/generative-ai@latest/+esm';

    const API_KEY = "";
    const genAI = new GoogleGenerativeAI(API_KEY);

  
    const username = "Sarthak";
    const account_num = "980000000000";

    // API endpoints
    const ENDPOINTS = {
      ITEMS: 'https://icy-bird-ddcc.dummyone137.workers.dev/available-items',
      PURCHASES: 'https://icy-bird-ddcc.dummyone137.workers.dev/purchases'
    };

 
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

   
    async function typeWriter(text, element, delay = 50) {
      element.innerHTML = "";
      for (let i = 0; i < text.length; i++) {
        element.innerHTML += text[i];
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

   
    async function fetchData(url) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      return response.json();
    }

   
    async function generateContent() {
      const userInput = document.getElementById('userInput').value;
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML = "Initializing...";

      try {
       
        outputDiv.innerHTML = "Loading data...";
        const [availableItems, purchaseHistory] = await Promise.all([
          fetchData(ENDPOINTS.ITEMS),
          fetchData(ENDPOINTS.PURCHASES)
        ]);

       
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-pro",
          systemInstruction: {
            role: "system",
            parts: [{
              text: `User: @${username}
                     Account: ${account_num}
                     Purchases: ${JSON.stringify(purchaseHistory)}
                     Available: ${JSON.stringify(availableItems)}
                     Format responses clearly with bullet points.`
            }]
          },
          safetySettings
        });

       
        outputDiv.innerHTML = "Generating response...";
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: userInput }] }]
        });

        
        const response = await result.response;
        const responseText = await response.text();

        await typeWriter(responseText, outputDiv, 50);

      } catch (error) {
        console.error("Error:", error);
        outputDiv.innerHTML = `Error: ${error.message}`;
      }
    }

  
    document.getElementById('generateBtn')?.addEventListener('click', generateContent);
