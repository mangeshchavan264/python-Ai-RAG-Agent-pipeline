import anthropic
import os

client = anthropic.Anthropic(
    base_url="https://bedrock-mantle.ap-south-1.api.aws/anthropic",
    api_key="shL3GKKvuCXikYdEKZXBCTTWT7GgpJUAMJMwFsMDQKDld5gg#5D4KYl0aMvCMyD9-fE82MsadtWs8tw5RJTSAqTvIOd8"
)

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    messages=[
        {
            "role": "user",
            "content": "Hello! Who are you?"
        }
    ],
)

print(response.content[0].text)