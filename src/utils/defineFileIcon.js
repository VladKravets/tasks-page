import React from 'react';
import { FileUnknownTwoTone, FilePdfTwoTone, FileWordTwoTone } from '@ant-design/icons';
import styled from 'styled-components';

const StyledFilePdfTwoTone = styled(FilePdfTwoTone)`
  margin-right: 8px;
`;

const StyledFileWordTwoTone = styled(FileWordTwoTone)`
  margin-right: 8px;
`;

const StyledFileUnknownTwoTone = styled(FileUnknownTwoTone)`
  margin-right: 8px;
`;

export default function defineFileIcon(fileName) {
  if (fileName.includes('.pdf')) return <StyledFilePdfTwoTone />;
  if (fileName.includes('.doc') || fileName.includes('.docx')) return <StyledFileWordTwoTone />;
  return <StyledFileUnknownTwoTone />;
}
