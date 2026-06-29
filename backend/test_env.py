from dotenv import load_dotenv
import os

load_dotenv()
key = os.getenv("GEMINI_API_KEY", "")
print(f"Key loaded: [{key}]")
print(f"Length: {len(key)}")
print(f"Is empty: {not key}")
print(f"Is placeholder: {key == 'your-key-here'}")
