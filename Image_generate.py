# !pip install --upgrade google-genai pillow
import os
os.environ["GOOGLE_API_KEY"] = ""

from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
from IPython.display import display

client = genai.Client()

user_prompt = input("Describe the image you want to generate: ")

response = client.models.generate_content(
    model="gemini-2.0-flash-exp-image-generation",
    contents=user_prompt,
    config=types.GenerateContentConfig(
      response_modalities=['TEXT', 'IMAGE']
    )
)

for part in response.candidates[0].content.parts:
  if part.text is not None:
    print(part.text)
  elif part.inline_data is not None:
    image = Image.open(BytesIO((part.inline_data.data)))
    image.save('custom-image.png')
    display(image)