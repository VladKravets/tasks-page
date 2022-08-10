import styled from 'styled-components/macro';

import { ReactComponent as IconDot } from 'assets/svg/Dot.svg';
import { ReactComponent as IconRemove } from 'assets/svg/IconRemove.svg';
import { ReactComponent as IconArrow } from 'assets/svg/IconLess.svg';
import { ReactComponent as IconClose } from 'assets/svg/IconCloseModal.svg';
import Avatar from 'assets/avatar.png';

import { CancelButton, SubmitButton } from 'components/Buttons';

export const HoverCircle = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background: white;
  display: grid;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #e7edf3;
  }
`;

export const Circle = styled.div`
  background-color: ${({ color }) => color};
  border-radius: 50%;
  line-height: 24px;
  height: 24px;
  width: 24px;
  text-align: center;
`;

export const AvatarIconLarge = styled.img.attrs(() => ({
  src: Avatar,
  alt: 'Avatar',
}))`
  line-height: 36px;
  height: 36px;
  width: 36px;
`;

export const AvatarIconSmall = styled(AvatarIconLarge)`
  line-height: 24px;
  height: 24px;
  width: 24px;
`;

export const LargeCircle = styled(Circle)`
  line-height: 36px;
  height: 36px;
  width: 36px;
`;

export const StatusContainer = styled.div`
  align-items: center;
  display: flex;
  grid-column: 2;
  justify-content: space-between;
  height: 36px;
  width: 129px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  padding: 8px;
  /* margin-top: 8px; */
  cursor: pointer;
`;

export const StatusList = styled.div`
  padding: 5px;
  width: 129px;
  left: 69px;
  position: absolute;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: -2px 2px 6px rgb(58 70 93 / 12%);
  z-index: 2;
  display: grid;
  justify-content: center;
  grid-row-gap: 10px;

  & > div {
    cursor: pointer;
  }
`;

export const ListItem = styled.div`
  display: grid;
  grid-template-columns: 45px 1fr 36px;
  ${({ isOpen }) => isOpen && `border-left: 5px solid #0376e3`};
  padding: 10px 16px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  height: 64px;

  & > div {
    margin-left: ${({ isOpen }) => (isOpen ? '-5px' : 0)};
  }
`;

export const Title = styled.div`
  font-size: 15px;
  line-height: 24px;
  color: ${({ isOpen }) => (isOpen ? '#304156' : '#007fd4')};
`;

export const SubTitle = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  background: #fafbfb;
  height: 28px;
  font-size: 12px;
  line-height: 16px;
  color: #828d99;
  padding: 0 24px;
`;

export const Summary = styled.div`
  display: grid;
  padding: 24px;
  grid-template-columns: 110px 1fr;
  grid-row-gap: 8px;
`;

export const Row = styled.div``;

export const Key = styled.div`
  font-size: 13px;
  line-height: 20px;
  color: #304156;
`;

export const Value = styled(Key)`
  font-size: 13px;
  line-height: 20px;
  color: ${({ clickable }) => (clickable ? '#007FD4' : '#828d99')};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
`;

export const ApproverInfo = styled.div`
  display: grid;
`;

export const Teams = styled(Key)`
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  color: #828d99;
  word-break: break-word;
`;

export const GridWrapper = styled.div`
  padding: 24px;
`;

export const Approver = styled.div`
  display: grid;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 26px;
  grid-template-columns: auto 1fr auto;
  grid-row-gap: 10px;
  grid-column-gap: 9px;
  border-bottom: 1px solid #f0f1f2;
  padding: 24px;
`;

export const AddButton = styled.div`
  font-size: 13px;
  line-height: 20px;
  color: #007fd4;
  cursor: pointer;
`;

export const Remove = styled(IconRemove)`
  cursor: pointer;
`;

export const Separator = styled.div`
  background: #e7edf3;
  height: 1px;
  margin-bottom: 24px;
`;

export const LoadingWrapper = styled.div`
  display: grid;
  align-content: center;
  justify-content: center;
  height: 550px;
  width: 428px;
`;

export const LoadingPropertiesWrapper = styled(LoadingWrapper)`
  margin: 0;
  height: 292px;
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
`;

export const Label = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: #828d99;
  padding-bottom: 8px;
`;

export const BodyRow = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 40px;
`;

export const DialogList = styled.div`
  display: grid;
  grid-template-rows: 73px 1fr 68px;
  grid-row-gap: 32px;
  align-items: center;
  height: 550px;
  width: 428px;
  overflow: hidden;
`;

export const DialogApproversHeader = styled.div`
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  justify-content: space-between;
  background: #fafbfb;
  height: 73px;
  padding: 0 24px;
  font-weight: 500;
  font-size: 18px;
  line-height: 29px;
  color: #304156;
`;

export const Close = styled(IconClose)`
  height: 13px;
  width: 13px;
  cursor: pointer;
`;

export const DialogBody = styled.div`
  display: grid;
  grid-auto-rows: min-content;
  overflow-y: auto;
  padding: 0 32px;
  height: 100%;
`;

export const DialogBodyProperties = styled(DialogBody)`
  grid-auto-rows: auto;
  overflow-y: initial;
`;

export const UserInfo = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-column-gap: 8px;
  align-items: center;
  border-bottom: 1px solid #f0f1f2;
  height: 56px;
`;

export const Username = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 24px;
  color: #304156;
`;

export const DialogApproversFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr 0.5fr;
  align-items: center;
  background: #fafbfb;
  height: 68px;
  padding: 0 24px;
  font-weight: normal;
  font-size: 15px;
  line-height: 24px;
  color: #828d99;
  border-top: 1px solid #f0f1f2;
`;

export const DialogListItem = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  padding: 24px;
  cursor: pointer;
  align-items: center;

  &:hover {
    background: #c7c4c4;
  }
`;

export const LinkWithIcon = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 30px 1fr;
  cursor: pointer;
`;

export const Expand = styled(IconArrow).attrs()`
  transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0)')};
  visibility: ${({ clickable }) => (clickable ? 'visible' : 'hidden')};
`;

export const VersionWrapper = styled.div``;

export const VersionHeader = styled.div`
  display: grid;
  padding: 24px;
  align-items: center;
  grid-template-columns: 25px 1fr 25px 36px;
  grid-column-gap: 13px;
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
`;

export const VersionTitle = styled.div`
  color: #304156;
  font-weight: 500;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const ChangesAmount = styled.div`
  color: #828d99;
  font-size: 13px;
`;

export const ChangesWrapper = styled.div`
  padding: 0px ​24px 24px 24px;
`;

export const ChangeDescription = styled.div`
  display: grid;
  grid-row-gap: 8px;
  font-size: 12px;
  margin: 0 24px;
  border-left: 1px solid #e7edf3;
  border-bottom: 1px solid #e7edf3;
  padding: 26px 0 17px 14px;
  line-height: 16px;
  position: relative;

  &:first-of-type {
    height: 63px;
    padding-top: 0;
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

export const ChangeDate = styled.div`
  display: grid;
  grid-template-columns: 1fr 52px;
  grid-row: 1;
`;

export const Datum = styled.div`
  color: #304156;
  font-weight: 500;
`;

export const Time = styled.div`
  color: #828d99;
  font-weight: 400;
`;

export const Message = styled.div`
  color: #304156;
  grid-row: 2;
`;

export const Dot = styled(IconDot)`
  grid-row: 1;
  position: absolute;
  left: -7px;
`;

export const DialogWrapper = styled.div`
  display: grid;
  grid-template-rows: min-content;
  grid-row-gap: 32px;
  text-align: center;
  justify-content: center;
  align-content: center;
  padding: 48px 32px;
  height: 360px;
  width: 520px;
`;

export const TitleWrapper = styled.div`
  display: grid;
  grid-row-gap: 2px;
`;

export const ModalTitle = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: #304156;
`;

export const ModalSubtitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #828d99;
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 16px;
`;

export const Action = styled.div`
  display: grid;
  align-content: center;
  justify-items: center;
  grid-row-gap: 8px;
  height: 184px;
  width: 220px;
  background: #fafbfb;
  border: 1px solid #f2f4f4;
  box-sizing: border-box;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #e7edf3;
  }
`;

export const IconCircle = styled.div`
  background: #f2f4f4;
  border-radius: 50%;
  height: 48px;
  width: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ActionText = styled.div`
  font-weight: 400;
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  color: #304156;
  max-width: 138px;
`;

export const Cancel = styled(CancelButton)`
  grid-column: 2;
`;

export const Submit = styled(SubmitButton)``;
