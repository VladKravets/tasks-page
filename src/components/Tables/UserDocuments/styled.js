import styled from 'styled-components';
import { Checkbox, Table } from 'antd';

export const Container = styled.div`
  max-width: 1920px;
  margin: auto !important;
`;

export const TableMenu = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const StyledCheckbox = styled(Checkbox)`
  display: block !important;
  margin-left: 0 !important;

  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

export const StyledTable = styled(Table)`
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #f5f5f5;
  overflow-x: auto;

  .ant-spin-nested-loading {
    width: fit-content;
  }
`;

export const DocumentName = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 300px;

  a {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 246px;
    display: inline-block;
  }
`;

export const DocumentType = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DocumentAction = styled.div`
  text-align: right !important;

  & > div {
    margin-left: auto;
    height: 24px;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    cursor: pointer;
  }
`;
