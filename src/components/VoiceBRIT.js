// src/components/VoiceBRIT.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import britApi from '../services/api';

// Import special components
import Blueprint from './Blueprint';
import ShelfZoom from './ShelfZoom';
import WordOptions from './WordOptions';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 90vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0;
`;

const Subtitle = styled.h2`
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-top: 5px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 50vh;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
  margin-bottom: 20px;
`;

const Message = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 20px;
  margin-bottom: 15px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
`;

const UserMessage = styled(Message)`
  background-color: #3498db;
  color: white;
  margin-left: auto;
  text-align: right;
`;

const BritMessage = styled(Message)`
  background-color: white;
  color: #34495e;
  border-left: 4px solid #3498db;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;

  &:focus {
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 0 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const VoiceButton = styled(Button)`
  background-color: ${props => props.listening ? '#e74c3c' : '#3498db'};
  animation: ${props => props.listening ? 'pulse 1.5s infinite' : 'none'};

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
    }
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(231, 76, 60, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
    }
  }
`;

const DisplayContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  min-height: 300px;
`;

const VoiceBRIT = () => {
    const [messages, setMessages] = useState([
        { type: 'brit', text: "Hello inventors, welcome to the Research and Development Center! I'm BRIT, your Bible Reciting Intelligence Technology. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayContent, setDisplayContent] = useState(null);
    const [listening, setListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSubmit(null, transcript);
            };

            recognitionRef.current.onend = () => {
                setListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setListening(false);
            };
        }
    }, []);

    // Initialize speech synthesis voices
    useEffect(() => {
        if ('speechSynthesis' in window) {
            // Load voices
            window.speechSynthesis.getVoices();

            // Some browsers need this event to get voices
            window.speechSynthesis.onvoiceschanged = () => {
                window.britVoices = window.speechSynthesis.getVoices();
            };
        }
    }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleListening = () => {
        if (listening) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
                setListening(true);
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    };

    const handleSubmit = async (e, voiceInput = null) => {
        if (e) e.preventDefault();

        const userMessage = voiceInput || input.trim();
        if (!userMessage || isLoading) return;

        setInput('');
        setMessages([...messages, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await britApi.sendMessage(userMessage);

            // Process response
            setTimeout(() => {
                setMessages(prev => [...prev, { type: 'brit', text: response.response }]);

                // Check for special actions
                if (response.actions) {
                    if (response.actions.showBlueprint) {
                        setDisplayContent(<Blueprint />);
                    } else if (response.actions.zoomShelf) {
                        setDisplayContent(<ShelfZoom />);
                    } else if (response.actions.showWordOptions) {
                        setDisplayContent(
                            <WordOptions options={response.actions.showWordOptions} />
                        );
                    }
                }

                // Speak the response
                speakResponse(response.response);

                setIsLoading(false);
            }, 500); // Add slight delay for natural feel
        } catch (error) {
            console.error('Error communicating with BRIT:', error);
            setMessages(prev => [...prev, {
                type: 'brit',
                text: "I'm having trouble connecting to my knowledge base. Please try again."
            }]);
            setIsLoading(false);
        }
    };

    const speakResponse = (text) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Get available voices
        const voices = window.britVoices || window.speechSynthesis.getVoices();

        // Try to find a female voice
        const preferredVoices = [
            'Google UK English Female',
            'Microsoft Zira',
            'Samantha',
            'Victoria'
        ];

        let selectedVoice = null;

        // Try to find preferred voice
        for (const voiceName of preferredVoices) {
            const voice = voices.find(v => v.name === voiceName);
            if (voice) {
                selectedVoice = voice;
                break;
            }
        }

        // If no preferred voice, find any female voice
        if (!selectedVoice) {
            selectedVoice = voices.find(voice =>
                voice.name.includes('female') ||
                voice.name.includes('girl') ||
                voice.name.includes('woman')
            );
        }

        // Set voice if found
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Adjust pitch and rate for child-friendly sound
        utterance.pitch = 1.1;  // Slightly higher
        utterance.rate = 1.0;   // Normal speed

        window.speechSynthesis.speak(utterance);
    };

    return (
        <Container>
            <Header>
                <Title>B.R.I.T.</Title>
                <Subtitle>Bible Reciting Intelligence Technology</Subtitle>
            </Header>

            <MainContent>
                <ChatContainer>
                    <MessagesContainer>
                        {messages.map((message, index) => (
                            message.type === 'user' ? (
                                <UserMessage key={index}>
                                    {message.text}
                                </UserMessage>
                            ) : (
                                <BritMessage key={index}>
                                    <strong>BRIT:</strong> {message.text}
                                </BritMessage>
                            )
                        ))}

                        {isLoading && (
                            <BritMessage>
                                <strong>BRIT:</strong> <em>Thinking...</em>
                            </BritMessage>
                        )}

                        <div ref={messagesEndRef} />
                    </MessagesContainer>

                    <InputContainer>
                        <Input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask BRIT something..."
                            disabled={isLoading || listening}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <Button
                            onClick={(e) => handleSubmit(e)}
                            disabled={isLoading || !input.trim() || listening}
                        >
                            Send
                        </Button>
                        <VoiceButton
                            listening={listening}
                            onClick={toggleListening}
                            disabled={isLoading}
                        >
                            {listening ? 'Listening...' : 'Voice'}
                        </VoiceButton>
                    </InputContainer>
                </ChatContainer>

                <DisplayContainer>
                    <AnimatePresence mode="wait">
                        {displayContent ? (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ width: '100%', height: '100%' }}
                            >
                                {displayContent}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="BRIT Logo"
                                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="%233498db" /><text x="100" y="120" font-size="60" text-anchor="middle" fill="white">BRIT</text></svg>';
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DisplayContainer>
            </MainContent>
        </Container>
    );
};

export default VoiceBRIT;