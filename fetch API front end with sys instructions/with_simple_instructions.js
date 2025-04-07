  
    import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from 'https://cdn.jsdelivr.net/npm/@google/generative-ai@latest/+esm';

    
    const API_KEY = ""; // Replace with your actual API key

 
    const genAI = new GoogleGenerativeAI(API_KEY);

    
    const username = "Sarthak";
    const account_num = "980000000000";

    const purchase_history = {
      purchases: [
        { item: "laptop", quantity: 2, models: ["Samsung", "LG"], amount: "Nrs 240000" },
        { item: "mobile", quantity: 2, models: ["Samsung", "LG"], amount: "Nrs 160000" }
      ]
    };

    const available_items = {
      available_items: [
        { item: "laptop", model: "Dell XPS", price: "Nrs 150000" },
        { item: "mobile", model: "iPhone 14", price: "Nrs 130000" }
      ]
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

    async function generateContent() {
      const userInput = document.getElementById('userInput').value;
      const outputDiv = document.getElementById('output');
      outputDiv.innerHTML = "Generating response...";

      try {
      
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-pro-exp-03-25",
          systemInstruction: {
            role: "system",
            parts: [{
              text: `Based on your history, '@${username} account num is ${account_num}'.
                     Purchase history: ${JSON.stringify(purchase_history)}.
                     Available items: ${JSON.stringify(available_items)}.`
            }]
          },
          safetySettings
        });

       
        const result = await model.generateContent({
          contents: [{
            role: "user",
            parts: [{ text: userInput }]
          }]
        });

       
        const response = await result.response;
        const text = await response.text();

  
        await typeWriter(text, outputDiv, 50); 
      } catch (error) {
        console.error("Error:", error);
        outputDiv.innerHTML = `Error generating response: ${error instanceof Error ? error.message : String(error)}`;
      }
    }

  
    document.getElementById('generateBtn')?.addEventListener('click', generateContent);