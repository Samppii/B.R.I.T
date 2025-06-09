// src/components/ShelfZoom.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ZoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ShelfScene = styled(motion.div)`
  width: 90%;
  height: 80%;
  background-color: #f8f9fa;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ShelfZoom = () => {
    return (
        <ZoomContainer>
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Scanning Shelf...
            </motion.h2>

            <ShelfScene
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {/* Shelf zoom content would go here */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    fontSize: '1.2rem',
                    color: '#3498db'
                }}>
                    [Shelf with ESR and Guy the Pizza Guy]
                </div>
            </ShelfScene>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                style={{ marginTop: '20px' }}
            >
                <h3>Target Located! ESR found with Guy the Pizza Guy!</h3>
            </motion.div>
        </ZoomContainer>
    );
};

export default ShelfZoom;