# !pip install --upgrade google-genai pillow
import os
os.environ["GOOGLE_API_KEY"] = ""

from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
from IPython.display import display
from google.colab import files

client = genai.Client()
uploaded = files.upload()
image_path = next(iter(uploaded))
image_bytes = uploaded[image_path]


user_prompt = """Act as a professional nutritionist. Analyze this food image carefully and:

1. Confirm if this is a recognizable food item (state clearly: "This appears to be [food name]")
2. Provide calorie estimate based on portion size with confidence level (High/Medium/Low)
3. List 3 key nutritional factors (e.g., "High in saturated fat", "Good fiber source")
4. Give brief explanation (20 words max) of your assessment
5. If unsure, say "Cannot confidently identify" instead of guessing

Do NOT use phrases like:
- "It might be..."
- "I think..."
- "Possibly..."
- "Could be..."

Format response clearly with bullet points. Keep entire analysis under 70 words."""

def prepare_image(image_bytes):
    img = Image.open(BytesIO(image_bytes))
    return genai.types.Part(
        inline_data=genai.types.Blob(
            mime_type=Image.MIME[img.format],
            data=image_bytes
        )
    )

contents = [
    user_prompt,
    prepare_image(image_bytes)
]

response = client.models.generate_content(
    model="gemini-2.0-flash-exp-image-generation",  # Better for analysis tasks
    contents=contents,
    config=types.GenerateContentConfig(
        response_modalities=['TEXT']  # We only need text for nutrition analysis
    )
)
print("\nNutritional Analysis Results:")
print("----------------------------")
for part in response.candidates[0].content.parts:
    if part.text:
        print(part.text)