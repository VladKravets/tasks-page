import React, { useState } from 'react';

import http from 'http/index';
import { ReactComponent as IconPdf } from 'assets/svg/IconPdf.svg';
import style from './style.module.scss';
import ViewerStatus from './ViewerStatus';
import ViewerProperties from './ViewerProperties';
import ViewerEdit from './ViewerEdit';
import ViewerAudit from './ViewerAudit';
import ViewerMetaData from './ViewerMetaData';
import ViewerCompare from './ViewerCompare';
import ViewerOneToOne from './ViewerOneToOne';

const ViewerInfo = ({ id, status: st, title, type }) => {
  const [status, setStatus] = useState(st);
  console.log(status);
  const handleChangeStatus = async (s) => {
    await http.patch(`/documents/${id}`, {
      status: s,
    });
    setStatus(s);
  };

  return (
    <div className={style.viewer__info}>
      <div className={style.wrapper_scroll}>
        <div className={style.viewer__info__title}>
          <div className={style.viewer__info__title__name}>
            <IconPdf />
            <p>
              {title && title}
              <br />
              <span>{type}</span>
            </p>
          </div>
          <div className={style.viewer__info__title__actions}>
            <ViewerStatus status={status} handleStatus={handleChangeStatus} />
            <ViewerProperties id={id} />
            <ViewerEdit />
            <ViewerAudit />
            <ViewerMetaData />
            <ViewerCompare />
            <ViewerOneToOne />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerInfo;
