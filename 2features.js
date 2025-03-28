 let model;
        const MODEL_PATH = 'model.json';  //directory

        async function loadModel() {
            try {
                model = await tf.loadGraphModel(MODEL_PATH);
                document.getElementById('result').innerHTML = 
                    `<span style="color: #2b8a3e;">Model loaded successfully!</span>`;
                console.log('Model input shape:', model.inputs[0].shape);
            } catch (err) {
               
                console.error('Model loading failed:', err);
            }
        }

        async function predict() {
            if (!model) {
                alert('Model is still loading. Please try again in a moment.');
                return;
            }

            const x1 = parseFloat(document.getElementById('x1').value);
            const x2 = parseFloat(document.getElementById('x2').value);

            if (isNaN(x1) || isNaN(x2)) {
                alert('Please enter valid numbers in both fields');
                return;
            }

            try {
              
                const inputTensor = tf.tensor2d([[x1, x2]]);
                const outputTensor = model.predict(inputTensor);
                const prediction = (await outputTensor.data())[0];

                document.getElementById('result').innerHTML = `
                   
                    <div style="margin-top: 1rem; font-weight: 500; color: #1864ab;">
                        Predicted output: ${prediction.toFixed(2)}
                    </div>
                `;

                
                inputTensor.dispose();
                outputTensor.dispose();
            } catch (err) {
                document.getElementById('result').innerHTML = 
                  
                console.error('Prediction failed:', err);
            }
        }

      
        loadModel();
