import styled from 'styled-components/macro';

const STATUS_CONFIG = {
  APPROVED: {
    color: '#287D3C',
    border: '1px solid #5ACA75',
  },
  REJECTED: {
    color: '#DA1414',
    border: '1px solid #F48989',
  },
  IN_PROGRESS: {
    color: '#B95000',
    border: '1px solid #FF8F39',
  },
  ASSIGNED: {
    color: '#2E5AAC',
    border: '1px solid #89A7E0',
  },
};

const StatusMark = styled.div`
  font-weight: 500;
  font-size: 10px;
  background: #ffffff;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  display: flex;
  text-align: center;
  text-transform: uppercase;
  height: 16px;
  width: 78px;
  ${({ type }) => STATUS_CONFIG[type]};
`;

export default StatusMark;
