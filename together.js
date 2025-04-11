async function getResponse() {
      const userPrompt = document.getElementById('userPrompt').value;
  
  
      const apiKey = ''; // <-- Replace with your actual API key
  
      // User-specific details
      const username = "Sarthak";
      const accountNum = "980000000000";
  
      const purchaseHistory = [
        { "item": "laptop", "quantity": 2, "models": ["Samsung", "LG"], "amount": "Nrs 240000" },
        { "item": "mobile", "quantity": 2, "models": ["Samsung", "LG"], "amount": "Nrs 160000" }
      ];
  
      const availableItems = [
        { "item": "laptop", "model": "Dell XPS", "price": "Nrs 150000" },
        { "item": "mobile", "model": "iPhone 14", "price": "Nrs 130000" }
      ];
  
   
      const systemInstruction = `Based on your history, '@${username} account num is ${accountNum}'. This is ${username}'s Purchase history: ${JSON.stringify(purchaseHistory)}. Available items: ${JSON.stringify(availableItems)}.`;
  
    
      const requestBody = {
        model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ]
      };
  
      try {
       
        const response = await fetch("https://api.together.xyz/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });
  
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  

        const data = await response.json();
  
     
        document.getElementById('responseContent').innerText = data.choices[0].message.content;
      } catch (error) {
    
        document.getElementById('responseContent').innerText = `Error: ${error.message}`;
      }
    }
  
    
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('getResponseBtn').addEventListener('click', getResponse);
    });
