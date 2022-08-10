import React, { useState } from 'react';
import { useAsync } from 'react-use';
import Moment from 'react-moment';

import { ReactComponent as IconProperties } from 'assets/svg/IconProperties.svg';
import { ReactComponent as IconArrowRight } from 'assets/svg/IconArrowDocumentViewer.svg';
import { ReactComponent as IconArrowLeft } from 'assets/svg/IconLeftView.svg';

import http from 'http/index';
import { formatBytes } from 'utils';

import PropertiesModal from './PropertiesModal';
import * as S from './styled';

const Properties = ({ id, data, setData, getChanges, handleSelectTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { value } = useAsync(async () => {
    const { data: types } = await http.get(`/document-types`);
    const { data: streams } = await http.get(`/streams`);
    const { data: users } = await http.get(`/users`);

    return {
      types: types.map((type) => ({ value: type.id, label: type.title })),
      streams: streams.map((stream) => ({
        value: stream.id,
        label: stream.title,
      })),
      users: users.map((user) => ({ value: user.id, label: user.username })),
    };
  }, []);

  const handleClick = () => {
    handleSelectTab(isOpen ? '' : 'properties');
    setIsOpen(!isOpen);
  };

  return (
    <>
      <S.ListItem onClick={handleClick} isOpen={isOpen}>
        {isOpen ? (
          <S.HoverCircle>
            <IconArrowLeft />
          </S.HoverCircle>
        ) : (
          <S.HoverCircle>
            <IconProperties />
          </S.HoverCircle>
        )}
        <S.Title>Properties</S.Title>
        {isOpen ? (
          ''
        ) : (
          <S.HoverCircle>
            <IconArrowRight />
          </S.HoverCircle>
        )}
      </S.ListItem>
      {isOpen && (
        <>
          <S.SubTitle>
            <div>File info</div>
            <S.AddButton onClick={() => setIsEditModalOpen(true)}>Edit</S.AddButton>
          </S.SubTitle>
          <S.Summary>
            <S.Key>Pages:</S.Key>
            <S.Value>{data.pages}</S.Value>
            <S.Key>Version:</S.Key>
            <S.Value>{data.version}</S.Value>
            <S.Key>Assignee:</S.Key>
            <S.Value clickable>{data.assignee.username}</S.Value>
            <S.Key>Document type:</S.Key>
            <S.Value>{data.type.title}</S.Value>
            <S.Key>Countries:</S.Key>
            <S.Value>{data.countries.join(', ')}</S.Value>
            <S.Key>Cities:</S.Key>
            <S.Value>{data.cities.join(', ')}</S.Value>
            <S.Key>Due date:</S.Key>
            <S.Value>{data.due}</S.Value>
            <S.Key>Statistic:</S.Key>
            <S.Value>
              {data.words} words, {data.images} images
            </S.Value>
            <S.Key>Visibility:</S.Key>
            <S.Value clickable>{data.privacy}</S.Value>
            <S.Key>Language:</S.Key>
            <S.Value clickable>{data.language}</S.Value>
            <S.Key>Owner:</S.Key>
            <S.Value clickable>{data.owner.username}</S.Value>
            <S.Key>Created:</S.Key>
            <S.Value>
              <Moment format="MMMM Do YYYY h:mm">{data.uploaded}</Moment>
            </S.Value>
            <S.Key>Modified:</S.Key>
            <S.Value clickable>{data.updater.username}</S.Value>
            <S.Key>Modified:</S.Key>
            <S.Value clickable>{data.updater.username}</S.Value>
            <S.Key>Modified time:</S.Key>
            <S.Value>
              <Moment format="MMMM Do YYYY h:mm">{data.updated}</Moment>
            </S.Value>
            <S.Key>Stream:</S.Key>
            <S.Value>{data.stream.title}</S.Value>
            <S.Key>Size:</S.Key>
            <S.Value>{formatBytes(data.size)}</S.Value>
          </S.Summary>
        </>
      )}
      <PropertiesModal
        {...value}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        id={id}
        data={data}
        setData={setData}
        getChanges={getChanges}
      />
    </>
  );
};

export default Properties;
