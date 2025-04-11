import Together from "together-ai";

async function getResponse() {
 
  const userPrompt = document.getElementById('userPrompt').value;

  // Initialize the Together client with your API key
  const together = new Together({ 
    apiKey: '' // 
  });

  // User-specific details
  const username = "Sarthak";
  const accountNum = "980000000000";

  const purchaseHistory = [
    { item: "laptop", quantity: 2, models: ["Samsung", "LG"], amount: "Nrs 240000" },
    { item: "mobile", quantity: 2, models: ["Samsung", "LG"], amount: "Nrs 160000" }
  ];

  const availableItems = [
    { item: "laptop", model: "Dell XPS", price: "Nrs 150000" },
    { item: "mobile", model: "iPhone 14", price: "Nrs 130000" }
  ];


  const systemInstruction = `Based on your history, '@${username} account num is ${accountNum}'. This is ${username}'s purchase history: ${JSON.stringify(purchaseHistory)}. Available items: ${JSON.stringify(availableItems)}.`;

 
  const requestBody = {
    model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt }
    ]
  };

  try {
    const response = await together.chat.completions.create(requestBody);


    document.getElementById('responseContent').innerText = response.choices[0].message.content;
  } catch (error) {
   
    document.getElementById('responseContent').innerText = `Error: ${error.message}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('getResponseBtn').addEventListener('click', getResponse);
});
