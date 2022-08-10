import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const RedirectPage = () => {
  const { streams } = useSelector((state) => state.streams);
  const history = useHistory();

  if (streams[0]) {
    history.push(`/streams/${streams[0].id}`);
  }
  return <></>;
};

export default RedirectPage;
