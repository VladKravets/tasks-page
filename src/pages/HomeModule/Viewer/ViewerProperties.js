import cn from 'classnames';
import React, { useState, useEffect, Fragment } from 'react';
import Moment from 'react-moment';

import { ReactComponent as IconProperties } from 'assets/svg/IconProperties.svg';
import { ReactComponent as IconArrowRight } from 'assets/svg/IconArrowDocumentViewer.svg';
import { ReactComponent as IconArrowLeft } from 'assets/svg/IconLeftView.svg';

import http from 'http/index';

import style from './style.module.scss';

const Properties = ({ approvers, properties }) => (
  <div className={style.properties}>
    <div className={style.properties__title}>
      <p>File info</p>
    </div>
    <div className={style.properties__statistics}>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Statistic</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p>
            {properties.words} words, {properties.images} images
          </p>
        </div>
      </div>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Visibility</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p style={{ color: '#007FD4' }}>{properties.privacy}</p>
        </div>
      </div>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Owner</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p style={{ color: '#007FD4' }}>{properties.owner.username}</p>
        </div>
      </div>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Created</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p>
            <Moment format="MMMM Do YYYY h:mm">{properties.uploaded}</Moment>
          </p>
        </div>
      </div>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Modified</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p style={{ color: '#007FD4' }}>{properties.updater.username}</p>
        </div>
      </div>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Modified time</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p>
            <Moment format="MMMM Do YYYY h:mm">{properties.updated}</Moment>
          </p>
        </div>
      </div>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Stream</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p>{properties.stream.title}</p>
        </div>
      </div>
      <div className={style.properties__statistics__item}>
        <div className={style.properties__statistics__item__key}>
          <p>Size</p>
        </div>
        <div className={style.properties__statistics__item__value}>
          <p>{properties.size}</p>
        </div>
      </div>
    </div>
    <div className={style.properties__title}>
      <p>Approvers</p>
    </div>
    {approvers.length ? (
      <div className={style.approver}>
        {approvers.map((approver) => (
          <Fragment key={approver.subject.id}>
            <img src={approver.subject.avatar} width="36px" height="36px" alt="approver-avatar" />
            <span>
              {approver.subject.username}
              {/* TODO: link 'you' title with auth user props */}
              {/* <span className={style.properties__statistics__item__value}>(You)</span> */}
            </span>
            <span
              className={cn(
                style.status,
                `${/APPROVED/.test(approver.status) ? style.approved : ''}`,
                `${/ASSIGNED/.test(approver.status) ? style.reviewed : ''}`,
                `${/IN_PROGRESS/.test(approver.status) ? style.assigned : ''}`,
                `${/REJECTED/.test(approver.status) ? style.rejected : ''}`
              )}
            >
              {approver.status.split('_').join(' ')}
            </span>
          </Fragment>
        ))}
      </div>
    ) : (
      <span className={style.no__approves}>No approves yet</span>
    )}
  </div>
);

const ViewerProperties = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [properties, setProperties] = useState({});
  const [approvers, setApprovers] = useState({});

  const requestProperties = async () => {
    const result = await http.get(`/documents/${id}`);
    setProperties(result.data);
  };

  const fetchApprovers = async () => {
    const result = await http.get(`/documents/${id}/approvers`);
    setApprovers(result.data);
  };

  useEffect(() => {
    requestProperties();
    fetchApprovers();
  }, [id]);

  return (
    <>
      <div onClick={(e) => setIsOpen(!isOpen)} className={cn(style.viewerProperties, `${isOpen ? style.isOpen : ''}`)}>
        <div className={style.viewerProperties__wrapper}>
          <div className={style.viewerProperties__wrapper__icon}>{isOpen ? <IconArrowLeft /> : <IconProperties />}</div>
          <p>Properties</p>
        </div>
        <div className={style.viewerProperties__iconToogle}>{isOpen ? '' : <IconArrowRight />}</div>
      </div>
      {isOpen && (
        <div>
          <Properties approvers={approvers} properties={properties} />
        </div>
      )}
    </>
  );
};

export default ViewerProperties;
