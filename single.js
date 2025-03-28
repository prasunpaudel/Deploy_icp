 let model;
        
       
        const modelPath = 'model.json';  // Local directory
        // If you host it on Google Drive or a public URL, use the full path:
        // const modelPath = 'https://aganjasarthak/tfjs_model/model.json';

      
        async function loadModel() {
            try {
                model = await tf.loadGraphModel(modelPath);
                console.log("Model loaded. Input shape:", model.inputs[0].shape);
                document.getElementById('result').innerHTML = "Model ready!";
            } catch (err) {
                console.error("Load error:", err);
                document.getElementById('result').innerHTML = 
                    `Error: ${err.message}<br>Check console and file paths.`;
            }
        }

      
        async function predict() {
            if (!model) {
                alert("Model not loaded yet");
                return;
            }

            try {
                const inputValue = parseFloat(document.getElementById('inputValue').value);
                const inputTensor = tf.tensor2d([[inputValue]], [1, 1]);
                const outputTensor = model.predict(inputTensor);
                const prediction = await outputTensor.data();

                inputTensor.dispose();
                outputTensor.dispose();

                document.getElementById('result').innerHTML = 
                    `Prediction: ${prediction[0].toFixed(2)}`;
            } catch (err) {
                console.error("Prediction error:", err);
                document.getElementById('result').innerHTML = 
                    `Prediction failed: ${err.message}`;
            }
        }

     
        loadModel();
