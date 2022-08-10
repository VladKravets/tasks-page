import { Modal, Select } from 'antd';
import React, { useCallback, useState, useEffect } from 'react';
import { useAsyncFn } from 'react-use';
import { CircularProgress } from '@material-ui/core';
import { format } from 'date-fns';

import DatePicker from 'components/DatePicker';

import http from 'http/index';

import * as S from './styled';

const PropertiesModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  types = [],
  streams = [],
  users = [],
  data,
  setData,
  getChanges,
  id,
}) => {
  const { Option } = Select;

  const [initialValues, setInitialValues] = useState({});
  const [properties, setProperties] = useState({
    streamId: data && data.stream.id,
    due: data && data.due,
    typeId: data && data.type.id,
    assigneeId: data && data.assignee.id,
  });

  useEffect(() => {
    setProperties({
      streamId: data.stream.id,
      due: data.due,
      typeId: data.type.id,
      assigneeId: data.assignee.id,
    });
    setInitialValues({
      streamId: data.stream.id,
      due: data.due,
      typeId: data.type.id,
      assigneeId: data.assignee.id,
    });
  }, [data]);

  const [{ loading }, handleApply] = useAsyncFn(async () => {
    const { data: newDocumentData } = await http.patch(
      `/documents/${id}`,
      Object.fromEntries(
        Object.entries(properties).filter(([key, value]) => value !== initialValues[key])
      )
    );
    await getChanges();
    setData(newDocumentData);
    setIsEditModalOpen(false);
  }, [getChanges, id, initialValues, properties, setData, setIsEditModalOpen]);

  const handlePropChange = useCallback(
    (prop) => (value) =>
      setProperties({
        ...properties,
        [prop]: prop === 'due' && value ? new Date(value).toISOString().slice(0, 10) : value || '',
      }),
    [properties]
  );

  const handleCancel = useCallback(() => {
    setProperties({
      streamId: data.stream.id,
      due: data.due,
      typeId: data.type.id,
      assigneeId: data.assignee.id,
    });
    setIsEditModalOpen(false);
  }, [data.assignee.id, data.due, data.stream.id, data.type.id, setIsEditModalOpen]);

  return (
    <Modal
      title="Edit Properties"
      visible={isEditModalOpen}
      onOk={handleApply}
      onCancel={handleCancel}
      okText="Apply"
      bodyStyle={{ padding: '50px 24px' }}
      centered
    >
      {loading ? (
        <S.LoadingPropertiesWrapper>
          <CircularProgress />
        </S.LoadingPropertiesWrapper>
      ) : (
        <S.BodyRow>
          <div>
            <S.Label>Document Type</S.Label>
            <Select
              labe
              defaultValue={properties.typeId}
              onChange={handlePropChange('typeId')}
              style={{ width: '100%' }}
              placeholder="Document type"
            >
              {types.map(({ value, label }) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>
          <S.InputRow>
            <div>
              <S.Label>Stream</S.Label>
              <Select
                defaultValue={properties.streamId}
                onChange={handlePropChange('streamId')}
                style={{ width: '100%' }}
                placeholder="Stream"
              >
                {streams.map(({ value, label }) => (
                  <Option key={value} value={value}>
                    {label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <S.Label>Due Date</S.Label>
              <DatePicker
                defaultValue={
                  properties.due ? format(new Date(properties.due), 'yyyy-MM-dd') : null
                }
                // format={'YYYY/MM/DD'}
                onChange={handlePropChange('due')}
              />
            </div>
          </S.InputRow>
          <div>
            <S.Label>Assignee</S.Label>
            <Select
              defaultValue={properties.assigneeId}
              onChange={handlePropChange('assigneeId')}
              style={{ width: '100%' }}
              placeholder="Assignee"
            >
              {users.map(({ value, label }) => (
                <Option key={value} value={value}>
                  {label}
                </Option>
              ))}
            </Select>
          </div>
        </S.BodyRow>
      )}
    </Modal>
  );
};

export default PropertiesModal;
