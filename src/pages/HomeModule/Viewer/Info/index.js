import React, { useCallback } from 'react';
import { useAsync, useAsyncFn } from 'react-use';

import { ReactComponent as IconPdf } from 'assets/svg/IconPdf.svg';
import { ReactComponent as IconDocx } from 'assets/svg/IconDocx.svg';

import http from 'http/index';

import Properties from './components/Properties';
import Approvers from './components/Approvers';
import Audit from './components/Audit';
import Status from './components/Status';

import * as S from './styled';

const Info = ({
  id,
  data: {
    status: st,
    title,
    type: { title: typeTitle },
  },
  data,
  setData,
  tab,
  setTab,
}) => {
  const docExtension = title.split('.').pop();

  const [{ value }, getChanges] = useAsyncFn(async () => {
    const { data: changesData } = await http.get(`/documents/${id}/changes`);

    return changesData.reverse();
  }, [id]);

  const handleChangeStatus = useCallback(
    async (newStatus) => {
      const { data } = await http.patch(`/documents/${id}`, {
        status: newStatus,
      });
      setData(data);
    },
    [id, setData]
  );

  useAsync(async () => {
    await getChanges();
  }, [getChanges, data]);

  return (
    <S.Sidebar>
      <S.ShortInfo>
        {/pdf/.test(docExtension) ? <IconPdf /> : <IconDocx />}
        <S.DocInfo>
          <S.Title title={title}>{title}</S.Title>
          {title.length > 26 && <S.DocExtension>{docExtension}</S.DocExtension>}
          <S.Subtitle title={typeTitle}>{typeTitle}</S.Subtitle>
        </S.DocInfo>
        <Status status={st} handleChangeStatus={handleChangeStatus} />
      </S.ShortInfo>
      <S.List>
        {(tab === 'properties' || !tab) && (
          <Properties
            id={id}
            data={data}
            setData={setData}
            getChanges={getChanges}
            handleSelectTab={setTab}
          />
        )}
        {(tab === 'approvers' || !tab) && (
          <Approvers id={id} getChanges={getChanges} handleSelectTab={setTab} />
        )}
        {/* {(tab === 'compare' || !tab) && <Compare handleSelectTab={setTab} />} */}
        {(tab === 'audit' || !tab) && (
          <Audit
            getChanges={getChanges}
            id={id}
            changesData={value}
            handleSelectTab={setTab}
          />
        )}
      </S.List>
    </S.Sidebar>
  );
};

export default Info;
