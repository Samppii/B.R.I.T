// src/components/WordOptions.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const WordOptionsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 80%;
  max-width: 400px;
`;

const OptionButton = styled(motion.button)`
  padding: 15px 20px;
  background-color: #f8f9fa;
  border: 2px solid #dfe6e9;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.selected {
    background-color: #e8f4fd;
    border-color: #3498db;
  }
  
  &.correct {
    background-color: #d4edda;
    border-color: #28a745;
    color: #155724;
  }
`;

const WordOptions = ({ options = ["Jam test", "Jaden", "Adjustment"] }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        if (option.toLowerCase() === "adjustment") {
            setTimeout(() => {
                setIsCorrect(true);
            }, 500);
        }
    };

    return (
        <WordOptionsContainer>
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Unscrambling Letters...
            </motion.h2>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                What does the ESR need?
            </motion.h3>

            <OptionsContainer>
                {options.map((option, index) => (
                    <OptionButton
                        key={index}
                        className={
                            selectedOption === option
                                ? isCorrect && option.toLowerCase() === "adjustment"
                                    ? "selected correct"
                                    : "selected"
                                : ""
                        }
                        onClick={() => handleOptionClick(option)}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (index * 0.2) }}
                    >
                        {option}
                        {isCorrect && option.toLowerCase() === "adjustment" && (
                            <span style={{ marginLeft: '10px', color: 'green' }}>✓</span>
                        )}
                    </OptionButton>
                ))}
            </OptionsContainer>

            {isCorrect && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{ marginTop: '30px', textAlign: 'center' }}
                >
                    <h3>Correct! The ESR needs an adjustment!</h3>
                </motion.div>
            )}
        </WordOptionsContainer>
    );
};

export default WordOptions;