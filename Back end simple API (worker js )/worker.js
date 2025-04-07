export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    if (url.pathname === '/purchases') {
      const purchaseHistory = {
        purchases: [
          {
            item: "laptop",
            quantity: 2,
            models: ["Samsung", "LG"],
            amount: "Nrs 240000"
          },
          {
            item: "mobile",
            quantity: 2,
            models: ["Samsung", "LG"],
            amount: "Nrs 160000"
          },
          {
            item: "headphones",
            quantity: 1,
            models: ["Sony"],
            amount: "Nrs 30000"
          },
          {
            item: "tablet",
            quantity: 1,
            models: ["iPad Air"],
            amount: "Nrs 70001.111"
          }
        ]
      };

      return new Response(JSON.stringify(purchaseHistory), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (url.pathname === '/available-items') {
      const availableItems = {
        available_items: [
          { item: "laptop", model: "Dell XPS", price: "Nrs 150000" },
          { item: "mobile", model: "iPhone 14", price: "Nrs 130000" },
          { item: "tablet", model: "iPad Air", price: "Nrs 70000" },
          { item: "headphones", model: "Sony WH-1000XM5", price: "Nrs 45000" },
          { item: "smartwatch", model: "Apple Watch SE", price: "Nrs 38000" },
          { item: "monitor", model: "LG UltraGear", price: "Nrs 65000" },
          { item: "keyboard", model: "Logitech MX Keys", price: "Nrs 13000" },
          { item: "mouse", model: "Razer DeathAdder", price: "Nrs 8000" },
          { item: "router", model: "TP-Link Archer AX55", price: "Nrs 17000" },
          { item: "printer", model: "HP DeskJet 2755e", price: "Nrs 10000" },
          { item: "speakers", model: "Bose Companion 2", price: "Nrs 20000" },
          { item: "webcam", model: "Logitech C920", price: "Nrs 9000" },
          { item: "SSD", model: "Samsung 970 EVO 1TB", price: "Nrs 14000" },
          { item: "external HDD", model: "Seagate 2TB", price: "Nrs 10000" },
          { item: "flash drive", model: "SanDisk 64GB", price: "Nrs 2500" },
          { item: "gaming console", model: "PlayStation 5", price: "Nrs 85000" },
          { item: "graphics card", model: "NVIDIA RTX 4070", price: "Nrs 90000" },
          { item: "CPU", model: "Intel i7 13700K", price: "Nrs 65000" },
          { item: "RAM", model: "Corsair 16GB DDR5", price: "Nrs 18000" },
          { item: "motherboard", model: "ASUS ROG Strix", price: "Nrs 35000" },
          { item: "power bank", model: "Anker 20K mAh", price: "Nrs 8000" },
          { item: "camera", model: "Canon EOS M50", price: "Nrs 90000" },
          { item: "tripod", model: "Manfrotto Compact", price: "Nrs 12000" },
          { item: "microphone", model: "Blue Yeti", price: "Nrs 17000" },
          { item: "projector", model: "Epson Home Cinema", price: "Nrs 80000" },
          { item: "VR headset", model: "Meta Quest 3", price: "Nrs 55000" },
          { item: "smart TV", model: "Samsung 55\" 4K", price: "Nrs 95000" },
          { item: "smart bulb", model: "Philips Hue", price: "Nrs 6500" },
          { item: "air purifier", model: "Dyson Pure Cool", price: "Nrs 75000" },
          { item: "coffee maker", model: "Nespresso Vertuo", price: "Nrs 22000" },
          { item: "washing machine", model: "LG Front Load 7kg", price: "Nrs 85000" },
          { item: "refrigerator", model: "Samsung Double Door", price: "Nrs 110000" },
          { item: "blender", model: "NutriBullet Pro", price: "Nrs 9000" },
          { item: "oven", model: "IFB 25L Convection", price: "Nrs 18000" },
          { item: "AC", model: "Daikin Inverter 1.5 Ton", price: "Nrs 110000" },
          { item: "fan", model: "Orient Electric", price: "Nrs 4500" }
        ]
      };

      return new Response(JSON.stringify(availableItems), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response("Not Found", { 
      status: 404,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
