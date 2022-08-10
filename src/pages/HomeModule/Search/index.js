import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import { useHistory } from 'react-router-dom';
import { Input, Button, Empty, Tabs } from 'antd';
import { SearchOutlined, FolderOutlined } from '@ant-design/icons';

import http from 'http/index';
import { convertToCapital, convertUnderline } from 'utils/convertText';
import defineFileIcon from 'utils/defineFileIcon';

import * as S from './styled';

const { TabPane } = Tabs;

function Search({ setIsSearchOpen, isSearchOpen }) {
  const history = useHistory();
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const {
    documents: { documents },
    tasks: { tasks },
    users: { users },
    streams: { streams },
  } = useSelector((state) => state);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setTimeout(() => {
      setSearch('');
      setSearchResult(null);
    }, 500);
  };

  useDebounce(
    async () => {
      if (!search) {
        setSearchResult(null);
        return;
      }
      const data = await http.get(`/search?text=${search}`).then((res) => res.data);
      const result = data.reduce(
        (acc, item) => {
          acc[item.kind] = [...acc[item.kind], item];
          return acc;
        },
        { Stream: [], Document: [], Task: [], Person: [], Team: [] }
      );
      setSearchResult(result);
    },
    500,
    [search]
  );

  const header = (
    <>
      <S.HeaderContainer>
        <S.SearchTitle weigth={700} size={16} margin={30}>
          Search
        </S.SearchTitle>
        <Input
          placeholder="Search"
          size="large"
          prefix={<SearchOutlined />}
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        />
      </S.HeaderContainer>
      <S.StyledTabs defaultActiveKey="All" activeKey={tab} onChange={(val) => setTab(val)}>
        <TabPane tab="All" key="All" />
        <TabPane tab={`Streams (${search ? searchResult?.Stream.length || 0 : streams?.length || 0})`} key="Streams" />
        <TabPane tab={`Documents (${search ? searchResult?.Document.length || 0 : documents?.length || 0})`} key="Documents" />
        <TabPane tab={`Tasks (${search ? searchResult?.Task.length || 0 : tasks?.length || 0})`} key="Tasks" />
        <TabPane tab={`Users (${search ? searchResult?.Person.length || 0 : users?.length || 0})`} key="Users" />
      </S.StyledTabs>
    </>
  );

  const BaseInfo = (
    <>
      {streams.length > 0 && tab === 'All' ? (
        <S.FragmentContainer>
          <S.SearchTitle margin={16}>Streams</S.SearchTitle>
          {streams?.slice(0, 2).map((item, index) => (
            <S.StyledItem key={index} onClick={() => history.push(`/streams/${item.id}`)}>
              <S.StyledMeta
                title={convertToCapital(item.title)}
                avatar={<S.StyledAvatar bgc={item.color} icon={<FolderOutlined />} shape="square" size={32} />}
                description={item?.description ? convertToCapital(item.description) : ''}
              />
            </S.StyledItem>
          ))}
        </S.FragmentContainer>
      ) : (
        tab === 'Streams' &&
        streams?.map((item, index) => (
          <S.StyledItem key={index} onClick={() => history.push(`/streams/${item.id}`)}>
            <S.StyledMeta
              title={convertToCapital(item.title)}
              avatar={<S.StyledAvatar bgc={item.color} icon={<FolderOutlined />} shape="square" size={32} />}
              description={item?.description ? convertToCapital(item.description) : ''}
            />
          </S.StyledItem>
        ))
      )}
      {documents.length > 0 && tab === 'All' ? (
        <S.FragmentContainer>
          <S.TitleContainer>
            <S.SearchTitle>Documents</S.SearchTitle>
            <Button type="link" onClick={() => history.push('/documents')}>
              View all
            </Button>
          </S.TitleContainer>
          {documents?.slice(0, 3).map((item, index) => (
            <S.StyledItem key={index} onClick={() => history.push(`/viewer`, { id: item.id })}>
              <S.StyledMeta
                title={convertToCapital(item.title)}
                avatar={<S.StyledAvatar bgc="#E6F7FF" icon={defineFileIcon(item.title)} size={32} />}
                description={item.type.title}
              />
            </S.StyledItem>
          ))}
        </S.FragmentContainer>
      ) : (
        tab === 'Documents' &&
        documents?.map((item, index) => (
          <S.StyledItem key={index} onClick={() => history.push(`/viewer`, { id: item.id })}>
            <S.StyledMeta
              title={convertToCapital(item.title)}
              avatar={<S.StyledAvatar bgc="#E6F7FF" icon={defineFileIcon(item.title)} size={32} />}
              description={item.type.title}
            />
          </S.StyledItem>
        ))
      )}
      {tasks?.length > 0 && tab === 'All' ? (
        <S.FragmentContainer>
          <S.TitleContainer>
            <S.SearchTitle>Tasks</S.SearchTitle>
            <Button type="link" onClick={() => history.push('/tasks')}>
              View all
            </Button>
          </S.TitleContainer>
          {tasks?.slice(0, 3).map((item, index) => (
            <S.StyledItem key={index} onClick={() => history.push(`/tasks`, { openTask: item.id })}>
              <S.StyledMeta
                title={convertToCapital(item.title)}
                avatar={<S.StyledAvatar bgc="#E6FFFB" icon={<S.StyledUnorderedListOutlined />} size={32} />}
                description={convertUnderline(item.type)}
              />
            </S.StyledItem>
          ))}
        </S.FragmentContainer>
      ) : (
        tab === 'Tasks' &&
        tasks?.map((item, index) => (
          <S.StyledItem key={index} onClick={() => history.push(`/tasks`, { openTask: item.id })}>
            <S.StyledMeta
              title={convertToCapital(item.title)}
              avatar={<S.StyledAvatar bgc="#E6FFFB" icon={<S.StyledUnorderedListOutlined />} size={32} />}
              description={convertUnderline(item.type)}
            />
          </S.StyledItem>
        ))
      )}
      {users.length > 0 && tab === 'All' ? (
        <S.FragmentContainer>
          <S.TitleContainer>
            <S.SearchTitle>Users</S.SearchTitle>
            <Button type="link" onClick={() => history.push('/users')}>
              View all
            </Button>
          </S.TitleContainer>
          {users?.slice(0, 3).map((item, index) => (
            <S.StyledItem key={index} onClick={() => history.push(`/users/${item.id}`)}>
              <S.StyledMeta
                title={convertToCapital(item.username)}
                avatar={
                  <S.StyledAvatar bgc={item.defaultAvatar} size={32}>
                    {item.username[0].toUpperCase()}
                  </S.StyledAvatar>
                }
                description={convertToCapital(item.role)}
              />
            </S.StyledItem>
          ))}
        </S.FragmentContainer>
      ) : (
        tab === 'Users' &&
        users?.map((item, index) => (
          <S.StyledItem key={index} onClick={() => history.push(`/users/${item.id}`)}>
            <S.StyledMeta
              title={convertToCapital(item.username)}
              avatar={
                <S.StyledAvatar bgc={item.defaultAvatar} size={32}>
                  {item.username[0].toUpperCase()}
                </S.StyledAvatar>
              }
              description={convertToCapital(item.role)}
            />
          </S.StyledItem>
        ))
      )}
    </>
  );

  const ResultInfo = useCallback(
    () => (
      <>
        {searchResult?.Stream?.length > 0 && tab === 'All' ? (
          <S.FragmentContainer>
            <S.SearchTitle margin={16}>Streams</S.SearchTitle>
            {searchResult.Stream.map((item, index) => {
              if (!streams.some((stream) => stream.id === item.id)) return null;
              const { title: t, color, description } = streams.find((stream) => stream.id === item.id);
              const title = t.toLowerCase() !== search.toLowerCase() ? t.toLowerCase().split(search.toLowerCase()) : [''];
              return (
                <S.StyledItem key={index} onClick={() => history.push(`/streams/${item.id}`)}>
                  <S.StyledMeta
                    title={title.map((part, index) => (part.toLowerCase() === '' ? <b key={index}>{search}</b> : part))}
                    avatar={<S.StyledAvatar bgc={color} icon={<FolderOutlined />} shape="square" size={32} />}
                    description={description ? convertToCapital(description) : ''}
                  />
                </S.StyledItem>
              );
            }).filter((item) => item !== null)}
          </S.FragmentContainer>
        ) : (
          tab === 'Streams' &&
          searchResult?.Stream.map((item, index) => {
            if (!streams.some((stream) => stream.id === item.id)) return null;
            const { title: t, color, description } = streams.find((stream) => stream.id === item.id);
            const title = t.toLowerCase() !== search.toLowerCase() ? t.toLowerCase().split(search.toLowerCase()) : [''];
            return (
              <S.StyledItem key={index} onClick={() => history.push(`/streams/${item.id}`)}>
                <S.StyledMeta
                  title={title.map((part, index) => (part.toLowerCase() === '' ? <b key={index}>{search}</b> : part))}
                  avatar={<S.StyledAvatar bgc={color} icon={<FolderOutlined />} shape="square" size={32} />}
                  description={description ? convertToCapital(description) : ''}
                />
              </S.StyledItem>
            );
          }).filter((item) => item !== null)
        )}
        {searchResult?.Document?.length > 0 && tab === 'All' ? (
          <S.FragmentContainer>
            <S.SearchTitle margin={16}>Documents</S.SearchTitle>
            {searchResult.Document.map((item, index) => {
              if (!documents.some((document) => document.id === item.id)) return null;
              const { title: t, type } = documents.find((document) => document.id === item.id);
              const title = t.toLowerCase() !== search.toLowerCase() ? t.toLowerCase().split(search.toLowerCase()) : [''];
              return (
                <S.StyledItem key={index} onClick={() => history.push(`/viewer`, { id: item.id })}>
                  <S.StyledMeta
                    title={title.map((part, index) => (part.toLowerCase() === '' ? <b key={index}>{search}</b> : part))}
                    avatar={<S.StyledAvatar bgc="#E6F7FF" icon={defineFileIcon(title)} size={32} />}
                    description={type.title}
                  />
                </S.StyledItem>
              );
            }).filter((item) => item !== null)}
          </S.FragmentContainer>
        ) : (
          tab === 'Documents' &&
          searchResult?.Document.map((item, index) => {
            if (!documents.some((document) => document.id === item.id)) return null;
            const { title: t, type } = documents.find((document) => document.id === item.id);
            const title = t.toLowerCase() !== search.toLowerCase() ? t.toLowerCase().split(search.toLowerCase()) : [''];
            return (
              <S.StyledItem key={index} onClick={() => history.push(`/viewer`, { id: item.id })}>
                <S.StyledMeta
                  title={title.map((part, index) => (part.toLowerCase() === '' ? <b key={index}>{search}</b> : part))}
                  avatar={<S.StyledAvatar bgc="#E6F7FF" icon={defineFileIcon(title)} size={32} />}
                  description={type.title}
                />
              </S.StyledItem>
            );
          }).filter((item) => item !== null)
        )}
        {searchResult?.Task?.length > 0 && tab === 'All' ? (
          <S.FragmentContainer>
            <S.SearchTitle margin={16}>Tasks</S.SearchTitle>
            {searchResult.Task.map((item, index) => {
              if (!tasks.some((task) => task.id === item.id)) return null;
              const { title: t, type } = tasks.find((task) => task.id === item.id);
              const title = t.toLowerCase() !== search.toLowerCase() ? t.toLowerCase().split(search.toLowerCase()) : [''];
              return (
                <S.StyledItem key={index} onClick={() => history.push(`/tasks`, { openTask: item.id })}>
                  <S.StyledMeta
                    title={title.map((part) => (part.toLowerCase() === '' ? <b>{search}</b> : part))}
                    avatar={<S.StyledAvatar bgc="#E6FFFB" icon={<S.StyledUnorderedListOutlined />} size={32} />}
                    description={convertUnderline(type)}
                  />
                </S.StyledItem>
              );
            }).filter((item) => item !== null)}
          </S.FragmentContainer>
        ) : (
          tab === 'Tasks' &&
          searchResult?.Task.map((item, index) => {
            if (!tasks.some((task) => task.id === item.id)) return null;
            const { title: t, type } = tasks.find((task) => task.id === item.id);
            const title = t.toLowerCase() !== search.toLowerCase() ? t.toLowerCase().split(search.toLowerCase()) : [''];
            return (
              <S.StyledItem key={index} onClick={() => history.push(`/tasks`, { openTask: item.id })}>
                <S.StyledMeta
                  title={title.map((part) => (part.toLowerCase() === '' ? <b>{search}</b> : part))}
                  avatar={<S.StyledAvatar bgc="#E6FFFB" icon={<S.StyledUnorderedListOutlined />} size={32} />}
                  description={convertUnderline(type)}
                />
              </S.StyledItem>
            );
          }).filter((item) => item !== null)
        )}
        {searchResult?.Person?.length > 0 && tab === 'All' ? (
          <S.FragmentContainer>
            <S.SearchTitle margin={16}>Users</S.SearchTitle>
            {searchResult.Person.map((item, index) => {
              if (!users.some((user) => user.id === item.id)) return null;
              const { username: n, defaultAvatar, role } = users.find((user) => user.id === item.id);
              const username = n.toLowerCase() !== search.toLowerCase() ? n.toLowerCase().split(search.toLowerCase()) : [''];
              console.log('username', username);
              return (
                <S.StyledItem key={index} onClick={() => history.push(`/users/${item.id}`)}>
                  <S.StyledMeta
                    title={username.map((part) => (part.toLowerCase() === '' ? <b>{search}</b> : part))}
                    avatar={
                      <S.StyledAvatar bgc={defaultAvatar} size={32}>
                        {n[0].toUpperCase()}
                      </S.StyledAvatar>
                    }
                    description={convertToCapital(role)}
                  />
                </S.StyledItem>
              );
            }).filter((item) => item !== null)}
          </S.FragmentContainer>
        ) : (
          tab === 'Users' &&
          searchResult?.Person.map((item, index) => {
            if (!users.some((user) => user.id === item.id)) return null;
            const { username: n, defaultAvatar, role } = users.find((user) => user.id === item.id);
            const username = n.toLowerCase() !== search.toLowerCase() ? n.toLowerCase().split(search.toLowerCase()) : [''];
            return (
              <S.StyledItem key={index} onClick={() => history.push(`/users/${item.id}`)}>
                <S.StyledMeta
                  title={username.map((part) => (part.toLowerCase() === '' ? <b>{search}</b> : part))}
                  avatar={
                    <S.StyledAvatar bgc={defaultAvatar} size={32}>
                      {n[0].toUpperCase()}
                    </S.StyledAvatar>
                  }
                  description={convertToCapital(role)}
                />
              </S.StyledItem>
            );
          }).filter((item) => item !== null)
        )}
        {searchResult?.Stream.length === 0 &&
          searchResult?.Person.length === 0 &&
          searchResult?.Task.length === 0 &&
          searchResult?.Document.length === 0 && <Empty />}
      </>
    ),
    [searchResult, tab, documents, history, search, streams, tasks, users]
  );

  return (
    <S.StyledDrawer
      visible={isSearchOpen}
      onClose={closeSearch}
      width={480}
      title={header}
      headerStyle={{ padding: 0, paddingTop: 16, border: 0 }}
    >
      {search ? ResultInfo() : BaseInfo}
    </S.StyledDrawer>
  );
}

export default Search;
