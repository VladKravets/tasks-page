import styled from 'styled-components/macro';

export const CancelButton = styled.button`
  height: 36px;
  width: 80px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  background: transparent;
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  color: #304156;
`;

export const SubmitButton = styled(CancelButton)`
  height: 36px;
  width: 110px;
  background: #0093ff;
  color: #ffffff;
`;
