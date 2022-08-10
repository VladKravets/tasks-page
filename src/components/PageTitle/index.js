import { PageHeader, Button } from 'antd';
import React from 'react';

import { ReactComponent as AddIcon } from './img/addIcon.svg';

const PageTitle = ({
  title,
  subTitle,
  extra,
  footer,
  handleAddClick,
  tags,
  avatar,
  ...props
}) => (
  <PageHeader
    style={{ background: '#fff', margin: '0 -24px 32px' }}
    title={title}
    subTitle={subTitle}
    tags={tags}
    avatar={avatar}
    {...(handleAddClick
      ? {
          tags: (
            <Button
              type="text"
              onClick={handleAddClick}
              icon={<AddIcon />}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '12px'
              }}
            />
          ),
        }
      : {})}
    extra={extra}
    footer={footer}
    {...props}
  />
);

export default PageTitle;
