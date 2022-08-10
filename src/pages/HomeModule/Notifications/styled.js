import styled from 'styled-components';
import { Drawer, List, Tabs, Avatar } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

export const StyledDrawer = styled(Drawer)`
  .ant-drawer-content-wrapper {
    @media screen and (max-width: 450px) {
      width: 100vw !important;
    }
  }
`;

export const HeaderTitle = styled.p`
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  padding-left: 24px;
  margin-bottom: 16px;
`;

export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    padding-left: 24px;
    margin: 0;
  }
`;

export const Container = styled.div`
  margin-bottom: 32px;
`;

export const Title = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
  margin-bottom: 10px;
`;

export const Item = styled.div`
  height: 58px;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;

  :hover {
    background: #f5f5f5;

    .anticon {
      display: block;
    }
  }
`;

export const CheckIcon = styled(CheckCircleFilled)`
  display: none;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10000;

  & > svg {
    fill: rgba(0, 0, 0, 0.25);
  }
`;

export const Description = styled.p`
  max-width: 65%;
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.45);
`;

export const Time = styled.p`
  margin: 0 0 auto auto;
  font-size: 12px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.45);
`;

export const StyledItem = styled(List.Item)`
  margin-left: -8px;
`;

export const StyledMeta = styled(List.Item.Meta)`
  align-items: center;
  padding: 8px;
  border-radius: 4px;

  :hover {
    background: #f5f5f5;
  }

  .ant-list-item-meta-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const StyledAvatar = styled(Avatar)`
  background-color: ${({ bgc }) => bgc};
  margin-right: 16px;
`;
