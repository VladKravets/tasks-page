import React from 'react';
import styled from 'styled-components';
import { format, isToday, isYesterday } from 'date-fns';

export const FullDate = styled.span`
  color: #8c8c8c;
  font-weight: normal;
`;

export default function cardTitleByDate(date) {
  if (isToday(new Date(date))) {
    return 'Today';
  } else if (isYesterday(new Date(date))) {
    return 'Yesterday';
  } else {
    return (
      <p>
        <span>{format(new Date(date), 'EEEE')}</span>, <FullDate>{format(new Date(date), 'dd MMM yyyy')}</FullDate>
      </p>
    );
  }
}
