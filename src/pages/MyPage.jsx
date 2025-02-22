import React from 'react';
import My from '../components/My';
import Navbar from '../components/home/Navbar';
import styled from 'styled-components';

const App = () => {
  return (
    <Container>
      <My />
      <Navbar />
    </Container>
  );
};

export default App;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
`;