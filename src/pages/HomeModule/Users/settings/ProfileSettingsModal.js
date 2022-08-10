import React, {useState} from 'react';
import { Modal, Tabs } from 'antd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ProfileInfo from './ProfileInfo';
import Roles from './Roles';
import Password from './Password';

const StyledModal = styled(Modal)`
  .ant-modal-header {
    border-bottom: none;
  }
  .ant-modal-body {
    padding: 0;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav-list {
    margin: 0 24px;
  }
  .ant-tabs-nav {
    margin: 0;
  }
`;

const Wrapper = styled.div`
  padding: 24px;
`;

const { TabPane } = Tabs;

const ProfileSettingsModal = ({
  user, isProfileSettingsOpen, handleProfileSettingsModal, fetchUser
}) => {
  const { user:loggedUser } = useSelector((state) => state.auth);
  const isMyProfile = user?.id === loggedUser?.id;
  const TABS = isMyProfile ? ['Profile info', 'Roles', 'Password'] : ['Profile info', 'Roles'];
  const [tab, setTab] = useState(TABS[0]);

  return (
    <>
    <StyledModal
      footer={null}
      visible={isProfileSettingsOpen}
      onCancel={handleProfileSettingsModal}
      title={`${isMyProfile ? 'My ' : ''}Profile Settings`}
    >
      <StyledTabs defaultActiveKey="1" onChange={setTab}>
        {TABS.map(tab => <TabPane tab={tab} key={tab}/>)}
      </StyledTabs>
      <Wrapper>
        {tab === 'Profile info' && <ProfileInfo fetchUser={fetchUser} isMyProfile={isMyProfile} user={user}/>}
        {tab === 'Roles' && <Roles fetchUser={fetchUser} isMyProfile={isMyProfile} user={user} loggedUser={loggedUser}/>}
        {tab === 'Password' && <Password/>}
      </Wrapper>
    </StyledModal>
    </>
  );
};

export default ProfileSettingsModal;
