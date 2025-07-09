  var vapiInstance = null;
  const assistant = "<assistant_id>"; 
  const apiKey = "<your_public_api_key>"; 
  const buttonConfig = {}; 

  (function (d, t) {
    var g = document.createElement(t),
      s = d.getElementsByTagName(t)[0];
    g.src =
      "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);

    g.onload = function () {
      vapiInstance = window.vapiSDK.run({
        apiKey: apiKey, 
        assistant: assistant, 
        config: buttonConfig, 
      });
    };
  })(document, "script");
