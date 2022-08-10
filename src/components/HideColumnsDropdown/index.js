import React from 'react';
import styled from 'styled-components';

import { Checkbox, Popover, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export const StyledCheckbox = styled(Checkbox)`
  display: block !important;
  margin-left: 0 !important;

  &:not(:last-child) {
    margin-bottom: 5px;
  }
`;

const HideColumnsDropdown = ({ columns, hideColumns, toggleHideColumn }) => {
  const content = (
    <div>
      {columns.map((column, index) => {
        return (
          <StyledCheckbox
            key={index}
            checked={!hideColumns.includes(column.title)}
            onChange={({ target }) => toggleHideColumn(target.name)}
            disabled={column.title === 'Task name'}
            name={column.title}
          >
            {column.title}
          </StyledCheckbox>
        );
      })}
    </div>
  );

  return (
    <Popover content={content} placement="bottom" trigger="click">
      <Button>
        Columns <DownOutlined />
      </Button>
    </Popover>
  );
};

export default HideColumnsDropdown;
