import os
import vertexai
from vertexai.generative_models import GenerativeModel

# GCP Configuration
PROJECT_ID = "593914291284"  # Using project number from authorization
LOCATION = "us-central1"
MODEL_ID = "gemini-3.5-flash"

print(f"Initializing Vertex AI for Project: {PROJECT_ID} in {LOCATION} using Model: {MODEL_ID}...")

try:
    # Initialize Vertex AI
    vertexai.init(project=PROJECT_ID, location=LOCATION)

    # Initialize Gemini model
    model = GenerativeModel(MODEL_ID)

    # Generate test request
    prompt = "Envie uma resposta de confirmação de que a conexão entre o Vertex AI e o script funcionou."
    print(f"Sending prompt: '{prompt}'")
    
    response = model.generate_content(prompt)
    
    print("\n--- Response ---")
    print(response.text)
    print("----------------")

except Exception as e:
    print(f"\nError: {e}")
    print("Certifique-se de que rodou 'gcloud auth application-default login' antes de executar este script.")
