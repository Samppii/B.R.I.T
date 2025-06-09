// src/components/Blueprint.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BlueprintContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BlueprintImage = styled(motion.div)`
  width: 90%;
  height: 70%;
  background-color: #cae8ff;
  border-radius: 10px;
  border: 2px dashed #3498db;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
`;

const BlueprintTitle = styled.h3`
  text-align: center;
  color: #2c3e50;
  margin-top: 0;
`;

const Blueprint = () => {
    return (
        <BlueprintContainer>
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Emotional Shrink Ray Blueprint
            </motion.h2>

            <BlueprintImage
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <BlueprintTitle>E.S.R. Model X-7</BlueprintTitle>

                {/* Blueprint SVG content would go here */}
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    [Blueprint Content]
                </div>
            </BlueprintImage>
        </BlueprintContainer>
    );
};

export default Blueprint;