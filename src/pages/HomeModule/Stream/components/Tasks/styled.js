import React from 'react';
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

export const StyledTable = styled(Table)`
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #f5f5f5;
  overflow-x: auto;
  //margin-bottom: 32px;

  .ant-table-row {
    cursor: pointer;
  }

  .ant-spin-nested-loading {
    width: fit-content;
  }
`;

export const StyledCheckbox = styled(({ ...otherProps }) => <Checkbox {...otherProps} />)`
  display: block !important;
  margin-left: 0 !important;

  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

export const TaskName = styled.p`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #1890ff;
`;
