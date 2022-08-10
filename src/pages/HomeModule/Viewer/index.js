import { CircularProgress } from '@material-ui/core';
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { useHistory } from 'react-router-dom';

import http from 'http/index';
import Viewer from 'components/Viewer';
import CompareViewer from 'components/CompareViewer';
import Info from './Info';

import * as S from './styled';

const ViewerPage = () => {
  const [data, setData] = useState(null);
  const [url, setUrl] = useState('');
  const [tab, setTab] = useState();
  const history = useHistory();

  const { loading } = useAsync(async () => {
    if (!(history.location.state && history.location.state.id)) {
      history.push('/documents');
      return;
    }

    // fetch pdf
    // const {data: blobData} = await fetch(
    //   `https://docs-stream.meg-analytics.com/api/documents/${history.location.state.id}/view?annotate-data-points=true`,
    //   {
    //     headers: { authorization: 'Basic YWJjOjEyMzQ1' },
    //   }
    // );
    const { data: blobData } = await http.get(
      `/documents/${history.location.state.id}/view?annotate-data-points=true`,
      { responseType: 'blob' }
    );
    // const bl = await viewUr.blob();
    // console.log(bl, viewUr, viewUrl);
    // fetch doc info
    const { data: documentData } = await http.get(`/documents/${history.location.state.id}`);

    // const blob = await viewUrl.blob();
    // console.log(blob);

    setUrl(URL.createObjectURL(blobData));
    setData(documentData);
  }, [history.location.state]);

  if (loading || !data)
    return (
      <S.Loading>
        <CircularProgress />
      </S.Loading>
    );

  return (
    <S.ViewerContainer>
      <S.Column>
        <S.Header>
          <S.BackLink
            to={history.location.state.fromStream ? `/streams/${history.location.state.fromStream}` : '/documents'}
          >
            <S.BackIcon />
            <S.BackSquare />
            Back to Home
          </S.BackLink>
        </S.Header>
        <Info id={history.location.state.id} data={data} setData={setData} tab={tab} setTab={setTab} />
      </S.Column>
      {tab === 'compare' ? (
        <CompareViewer />
      ) : (
        <Viewer id={history.location.state.id} url={url} dataPoints={data.dataPoints} title={data.title} />
      )}
    </S.ViewerContainer>
  );
};

export default ViewerPage;
