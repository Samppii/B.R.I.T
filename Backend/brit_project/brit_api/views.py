# brit_api/views.py
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import requests
import logging
from django.shortcuts import render
from .key_dialogues import get_script_response

logger = logging.getLogger(__name__)


def query_ollama(prompt, model="llama3:latest"):
    """
    Send a query to the Ollama API and properly handle streaming response
    """
    try:
        response = requests.post(
            'http://localhost:11434/api/generate',
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,  # Try to disable streaming
                "system": "You are BRIT (Bible Reciting Intelligence Technology), a helpful AI assistant for kids. Answer in no more than 1 sentence"
            },
            timeout=60
        )

        if response.status_code == 200:
            # Check if it's a streaming response by looking for multiple JSON objects
            if '\n' in response.text:
                # Handle streaming response - collect all tokens
                full_response = ""
                for line in response.text.strip().split('\n'):
                    if not line:
                        continue
                    try:
                        chunk = json.loads(line)
                        if 'response' in chunk:
                            full_response += chunk['response']
                    except json.JSONDecodeError:
                        logger.warning(f"Could not parse line: {line}")

                return full_response
            else:
                # Handle single JSON response
                try:
                    data = response.json()
                    return data.get('response', 'Sorry, I could not generate a response.')
                except json.JSONDecodeError:
                    logger.error(f"Could not parse single JSON: {response.text[:500]}")
                    return "I received a response but couldn't understand it. Please try again."
        else:
            logger.error(f"Ollama API error: {response.status_code} - {response.text}")
            return "I'm having trouble connecting to my knowledge base right now. Please try again!"

    except requests.exceptions.RequestException as e:
        logger.error(f"Error connecting to Ollama: {str(e)}")
        return "I can't reach my knowledge base at the moment. Is Ollama running?"


@api_view(['POST'])
def brit_response(request):
    """
    API endpoint to get responses from BRIT
    """
    try:
        data = request.data
        user_input = data.get('message', '')

        if not user_input:
            return Response({'response': 'Please ask me something!'})

        # First check for scripted responses
        script_response = get_script_response(user_input)

        if script_response:
            # Log the script match
            logger.info(f"User: {user_input}")
            logger.info(f"BRIT (Script): {script_response}")

            # Check for special actions
            actions = {}
            if "blueprint" in user_input.lower():
                actions["showBlueprint"] = True
            elif "zoom in on the shelf" in user_input.lower():
                actions["zoomShelf"] = True
            elif "highlighted letters" in user_input.lower():
                actions["showWordOptions"] = ["Jam test", "Jaden", "Adjustment"]

            return Response({
                'response': script_response,
                'actions': actions
            })

        # If no script match, use Ollama
        response = query_ollama(user_input)

        # Log the Ollama response
        logger.info(f"User: {user_input}")
        logger.info(f"BRIT (Ollama): {response}")

        return Response({'response': response})

    except Exception as e:
        logger.error(f"Error in brit_response: {str(e)}")
        return Response({
            'response': "Something went wrong. Please try again!",
            'error': str(e)
        }, status=500)


def index(request):
    """
    Render the main application page
    """
    return render(request, 'brit_api/index.html')