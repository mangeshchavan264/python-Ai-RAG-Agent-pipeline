import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("BEDROCK_API_KEY"),
    base_url="https://bedrock-mantle.ap-south-1.api.aws/v1",
    default_headers={
        "OpenAI-Project": "default"
    },
)

response = client.chat.completions.create(
    model="openai.gpt-oss-120b",
    messages=[
        {
            "role": "user",
            "content": "create a parrot"
        }
    ]
)

print(response.choices[0].message.content)