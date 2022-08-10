import React, { useRef, useEffect, useCallback, memo } from 'react';
import styled from 'styled-components/macro';

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 175px;
`;

const Dropdown = ({ setOpen, children, ...other }) => {
  const isRef = useRef(null);
  const handleClickOutside = useCallback(
    (e) => {
      if (isRef.current && !isRef.current.contains(e.target)) {
        setOpen(false);
      }
    },
    [setOpen]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [handleClickOutside]);

  return (
    <Container ref={isRef} {...other}>
      {children}
    </Container>
  );
};

export default memo(Dropdown);
