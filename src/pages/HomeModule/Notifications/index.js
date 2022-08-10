import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Tabs } from 'antd';
import { useAsync } from 'react-use';
import { format } from 'date-fns';

import http from 'http/index';
import { getFromStorage } from 'utils/storage';
import cardTitleByDate from 'utils/cardTitleByDate';
import notificationDescription from './utils/notificationDescription';

import * as S from './styled';

const { TabPane } = Tabs;

const Notifications = ({ isOpen, setIsOpen, setNewNotifications }) => {
  const history = useHistory();
  const [tab, setTab] = useState('Unread');
  const [unreadNotification, setUnreadNotification] = useState({});
  const [readedNotification, setReadNotification] = useState({});
  const {
    documents: { documents },
    tasks: { tasks },
    streams: { streams },
  } = useSelector((state) => state);

  useEffect(() => {
    const counter = Object.values(unreadNotification).reduce((acc, item) => {
      acc = acc + item.length;
      return acc;
    }, 0);

    setNewNotifications(counter);
    // eslint-disable-next-line
  }, [unreadNotification]);

  useAsync(async () => {
    const fetchData = await http
      .get('/notifications/user')
      .then((res) => res.data)
      .catch((err) => console.error(err));

    const groupedData = fetchData.reduce(
      (acc, item) => {
        const date = format(new Date(item.created), 'yyyy-MM-dd');

        !acc[item.status][date] ? (acc[item.status][date] = [item]) : (acc[item.status][date] = [...acc[item.status][date], item]);
        return acc;
      },
      {
        NEW: {},
        READ: {},
        ARCHIVED: {},
      }
    );

    setUnreadNotification(groupedData.NEW);
    setReadNotification(groupedData.READ);
    // setArchivedNotification(groupedData.ARCHIVED);
  }, [isOpen]);

  // const authToken = getFromStorage('docstream-token');
  // const socket = new WebSocket(`${process.env.REACT_APP_NOTIFICATION_SOCKET_URL}?token=${authToken}`);

  // socket.onmessage = (message) => {
  //   const data = JSON.parse(message.data);
  //   const date = format(new Date(data.created), 'yyyy-MM-dd');

  //   setUnreadNotification((prev) => {
  //     if (prev[date]) {
  //       if (prev[date].some((item) => item.id === data.id)) return prev;
  //       return { ...prev, [date]: [data, ...prev[date]] };
  //     }
  //     return { ...prev, [date]: [data] };
  //   });
  // };

  const readNotification = (date, notif) => {
    http.patch(`/notifications/${notif.id}?status=READ`);

    setUnreadNotification((prev) => {
      return { ...prev, [date]: prev[date].filter((item) => item.id !== notif.id) };
    });
    setReadNotification((prev) => {
      if (prev[date]) return { ...prev, [date]: [notif, ...prev[date]] };
      return { ...prev, [date]: [notif] };
    });
  };

  const handleRoute = ({ topic, topicID }) => {
    switch (topic) {
      case 'TASK':
        history.push('/tasks', { openTask: topicID });
        break;
      case 'DOCUMENT':
        const path = history.location.pathname;
        history.push('/viewer', { id: topicID, fromStream: path.includes('streams') && path.split('/')[1] });
        break;
      case 'STREAM':
        history.push(`/streams/${topicID}`);
        break;

      default:
        break;
    }
  };

  const handleOnClick = (e, item) => {
    if (e.target.nodeName === 'path' || e.target.nodeName === 'svg') return;
    handleRoute(item);
  };

  const header = (
    <>
      <S.HeaderTitle>Notifications</S.HeaderTitle>
      <S.StyledTabs defaultActiveKey="Unread" activeKey={tab} onChange={(val) => setTab(val)}>
        <TabPane tab={`Unread (${Object.values(unreadNotification).reduce((acc, item) => acc + item.length, 0)})`} key="Unread" />
        <TabPane tab={`All (${Object.values(readedNotification).reduce((acc, item) => acc + item.length, 0)})`} key="All" />
      </S.StyledTabs>
    </>
  );

  return (
    <S.StyledDrawer
      visible={isOpen}
      onClose={() => setIsOpen(false)}
      width={420}
      title={header}
      headerStyle={{ padding: 0, paddingTop: 16, border: 0 }}
    >
      {tab === 'Unread'
        ? Object.entries(unreadNotification)?.map((unread, index) => {
            return (
              <S.Container key={index}>
                <S.Title>{cardTitleByDate(unread[0])}</S.Title>
                {unread[1].map((item, index) => {
                  return (
                    <S.Item key={index} onClick={(e) => handleOnClick(e, item)}>
                      <S.StyledAvatar bgc={item.author.defaultAvatar} size={32}>
                        {item.author.username?.charAt(0).toUpperCase()}
                      </S.StyledAvatar>
                      <S.Description>{notificationDescription(item, documents, tasks, streams)}</S.Description>
                      <S.Time>{format(new Date(item.created), 'kk:mm')}</S.Time>
                      <S.CheckIcon onClick={() => readNotification(unread[0], item)} />
                    </S.Item>
                  );
                })}
              </S.Container>
            );
          })
        : Object.entries(readedNotification)?.map((read, index) => {
            return (
              <S.Container key={index}>
                <S.Title>{cardTitleByDate(read[0])}</S.Title>
                {read[1].map((item, index) => {
                  return (
                    <S.Item key={index} onClick={() => handleRoute(item)}>
                      <S.StyledAvatar bgc={item.author.defaultAvatar} size={32}>
                        {item.author.username?.charAt(0).toUpperCase()}
                      </S.StyledAvatar>
                      <S.Description>{notificationDescription(item, documents, tasks, streams)}</S.Description>
                      <S.Time>{format(new Date(item.created), 'kk:mm')}</S.Time>
                    </S.Item>
                  );
                })}
              </S.Container>
            );
          })}
    </S.StyledDrawer>
  );
};

export default Notifications;
