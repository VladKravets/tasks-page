import { Checkbox } from 'antd';
import React, { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import * as S from './styled';

const AddUsersDropdown = ({ usersState, setUsersState, filterState }) => {
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);

  const setUserAsAssignee = useCallback(
    (userToAssign) => () => {
      usersState.find(({ id }) => id === userToAssign.id)
        ? setUsersState((prev) => prev.filter(({ id }) => id !== userToAssign.id))
        : setUsersState([...usersState, userToAssign]);
    },
    [setUsersState, usersState]
  );

  const isUserChecked = useCallback((id) => (user.id === id ? true : usersState.find((_) => _.id === id)), [user.id, usersState]);

  const usersToDisplay = useMemo(() => users?.filter((userToFilter) => !filterState.some((user) => user.id === userToFilter.id)), [
    filterState,
    users,
  ]);

  return (
    <S.AssigneeDropdown>
      {usersToDisplay?.map((userToAssign) => {
        const { username, id, defaultAvatar } = userToAssign;
        return (
          <Checkbox
            key={id}
            {...(user.id === id ? { disabled: true } : {})}
            checked={isUserChecked(id)}
            onChange={setUserAsAssignee(userToAssign)}
          >
            <S.AvatarDropdown defaultAvatar={defaultAvatar}>{username[0].toUpperCase()}</S.AvatarDropdown>
            {username} {user.id === id ? <S.AdminText>(you)</S.AdminText> : ''}
          </Checkbox>
        );
      })}
    </S.AssigneeDropdown>
  );
};

export default memo(AddUsersDropdown);
