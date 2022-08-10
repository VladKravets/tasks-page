import React from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 1920px;
  margin: auto !important;
`;

const Container = ({ children }) => <Wrapper>{children}</Wrapper>;

export default Container;
