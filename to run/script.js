  var vapiInstance = null;
  const assistant = "b4fb045c-2b2b-482f-b121-79e46a1721c9"; 
  const apiKey = "063f65bf-5c8e-42a5-8d18-8e4b612ea7fd"; 
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
