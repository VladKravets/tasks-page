import { useLocation } from 'react-use';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components/macro';

import { Avatar, Button, Col, Dropdown, Row, Layout, Menu, Tooltip, message, Badge } from 'antd';
import { FileOutlined, TeamOutlined, SearchOutlined, BellOutlined, PlusOutlined,BarsOutlined} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import { logout } from 'store/auth/actions.auth';
import { toggleSideBar, changeOpenKeys } from 'store/sidebar/actions.sidebar';
import { convertToCapital } from 'utils/convertText';

import AddStreamModal from './AddStreamModal';
import Search from './Search';
import Notifications from './Notifications';
import * as S from './styled';

const { Item, SubMenu } = Menu;

const Submenu = styled(SubMenu)`
  line-height: 20px;

  & .ant-menu-submenu-title {
    font-weight: 700;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.4;
  }

  & .ant-menu-inline {
    background: none !important;
  }
`;

const SubmenuItem = styled(Item)`
  padding-left: 24px !important;
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: center;
  align-items: center;

  & span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ColorSquare = styled.div`
  width: 14px;
  height: 14px;
  background: ${({ color }) => color};
  border-radius: 2px;
`;

export const StyledNavLink = styled(NavLink)`
  text-transform: capitalize;
`;

const ROUTES = [
  {
    to: '/documents',
    title: 'Documents',
    icon: <FileOutlined />,
  },
  {
    to: '/tasks',
    title: 'Tasks',
    icon: <BarsOutlined />,
  },
  {
    to: '/users',
    title: 'Users',
    icon: <TeamOutlined />,
  },

];

const HomeLayout = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.users.users);

  const { sidebar, openKeys } = useSelector((state) => state.sidebar);
  const { streams } = useSelector((state) => state.streams);
  const [isAddStreamOpen, setIsAddStreamOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(0);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const toggle = useCallback(() => dispatch(toggleSideBar()), [dispatch]);
  const handleLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const handleMyProfile = () => history.push(`/users/${user.id}`);
  const handleAddStreamModal = useCallback(() => {
    if (streams.length >= 11) {
      message.config({
        top: 70,
        duration: 4,
        maxCount: 3,
      });

      message.warning('Exceeded the maximum number of streams!');
      return;
    }

    setIsAddStreamOpen(!isAddStreamOpen);
  }, [isAddStreamOpen, streams]);
  const onOpenChange = (items) => {
    dispatch(changeOpenKeys(items));
  };

  useEffect(() => {}, [dispatch]);

  const [collapsedWidth, setCollapsedWidth] = useState(80);

  return (
    <>
      <AddStreamModal users={users} visible={isAddStreamOpen} onCancel={handleAddStreamModal} />
      <Search setIsSearchOpen={setIsSearchOpen} isSearchOpen={isSearchOpen} />
      <Notifications isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} setNewNotifications={setNewNotifications} />
      <Layout>
        <S.Sidebar
          trigger={null}
          collapsible
          collapsed={!sidebar}
          breakpoint="md"
          collapsedWidth={collapsedWidth}
          onBreakpoint={(broken) => setCollapsedWidth(broken ? 0 : 80)}
        >
          <S.LogoContainer>
            <S.Logo />
            <S.LogoTitle hide={!sidebar}>TT International</S.LogoTitle>
            <S.MobileCloseMenu $hide={!sidebar} onClick={toggle} />
          </S.LogoContainer>
          <Menu theme="dark" mode="inline" selectedKeys={[pathname]} openKeys={openKeys} onOpenChange={onOpenChange}>
            {ROUTES.map(({ to, title, icon }) => (
              <Item key={to} icon={icon}>
                <NavLink to={to}>{title}</NavLink>
              </Item>
            ))}
            <Submenu key="streams" title="streams">
              {streams.map(({ color, title, id }) => (
                <SubmenuItem key={`/streams/${id}`} icon={<ColorSquare color={color} />}>
                  <Tooltip title={title.length > 13 ? title : null}>
                    <StyledNavLink exact to={`/streams/${id}`}>
                      {title.length > 13 ? `${title.slice(0, 13)}...` : title}
                    </StyledNavLink>
                  </Tooltip>
                </SubmenuItem>
              ))}
            </Submenu>
            <Item key="addStream" icon={<PlusOutlined />} onClick={handleAddStreamModal}>
              Add stream
            </Item>
          </Menu>
        </S.Sidebar>
        <S.LayoutContent $collapsed={!sidebar} $collapsedWidth={collapsedWidth}>
          <S.HeaderBack collapsed={!sidebar} collapsedWidth={collapsedWidth}>
            <S.HeaderContent>
              <Row justify="space-between" align="middle" style={{ padding: '0 24px' }}>
                <Col span={2}>{!sidebar ? <S.MenuUnfold onClick={toggle} /> : <S.MenuFold onClick={toggle} />}</Col>
                {
                  <Col span={22}>
                    <Row justify="end" align="middle">
                      <Col>
                        <Button type="text" shape="circle" icon={<SearchOutlined />} size="large" onClick={() => setIsSearchOpen(true)} />
                      </Col>
                      <Col>
                        <Badge dot={newNotifications !== 0} offset={[-14, 14]}>
                          <Button
                            type="text"
                            shape="circle"
                            icon={<BellOutlined />}
                            size="large"
                            onClick={() => setIsNotificationOpen(true)}
                          />
                        </Badge>
                      </Col>
                      <Col>
                        <Dropdown
                          overlay={
                            <Menu>
                              <Item>
                                <span onClick={handleLogout}>Logout</span>
                              </Item>
                              <Item>
                                <span onClick={handleMyProfile}>My Profile</span>
                              </Item>
                            </Menu>
                          }
                          arrow
                          trigger={collapsedWidth ? 'hover' : 'click'}
                        >
                          <S.StyledButton type="text" shape="circle" icon={<Avatar size="small">A</Avatar>} size="large">
                            {collapsedWidth !== 0 && convertToCapital(user?.username)}
                          </S.StyledButton>
                        </Dropdown>
                      </Col>
                    </Row>
                  </Col>
                }
              </Row>
            </S.HeaderContent>
          </S.HeaderBack>
          <S.ContentWhite $collapsed={!sidebar} $collapsedWidth={collapsedWidth}>
            {children}
          </S.ContentWhite>
        </S.LayoutContent>
      </Layout>
    </>
  );
};

export default HomeLayout;
