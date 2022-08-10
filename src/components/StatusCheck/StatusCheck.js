import React, { useState, useEffect } from 'react';
import cn from 'classnames';

import http from 'http/index';
import style from './style.module.scss';

const StatusCheck = ({ id }) => {
  const [items] = useState([
    { id: 1, title: 'Legal team', status: 'In progress' },
    { id: 2, title: 'Accounting team', status: 'Approved' },
    { id: 3, title: 'Operations team', status: 'Approved' },
    { id: 4, title: 'Mike Cather', status: 'Approved' },
  ]);

  useEffect(() => {
    http
      .get(
        `/documents/${id}/approvers`
      )
      .then((result) => {})
      .catch((err) => {
        console.log('Error : ', err);
      });
  });

  return (
    <div className={style.statusCheck}>
      <div className={style.statusCheck__title}>
        <p>Approvers</p>
      </div>
      <div className={style.statusCheck__items}>
        {items.map((item) => {
          return (
            <div className={style.statusCheck__items__item} key={item.id}>
              <p className={style.statusCheck__items__item__label}>
                {item.title}
              </p>
              <p
                className={cn(
                  style.statusCheck__items__item__status,
                  `${item.status.includes('Assignet') ? style.assignet : ''}`,
                  `${item.status.includes('Reviewed') ? style.reviewed : ''}`,
                  `${item.status.includes('Approved') ? style.approved : ''}`
                )}
              >
                {item.status}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusCheck;
