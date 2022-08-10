import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { format, formatDistance } from 'date-fns';

import http from 'http/index';
import activityTitleByAction from './utils/activityTitleByAction';
import cardTitleByDate from 'utils/cardTitleByDate';

import { List, Avatar, Card, Row, Col, Empty } from 'antd';
import StyledSpiner from 'components/Loader';

function Activity({ streamId }) {
  const [activityData, setActivityData] = useState(null);

  const { loading } = useAsync(async () => {
    const fetchData = await http
      .get(`/streams/${streamId}/changes`)
      .then((res) => res.data.sort((a, b) => new Date(b.at) - new Date(a.at)))
      .catch((err) => console.error(err));

    const groupedData = fetchData.reduce((acc, item) => {
      const date = format(new Date(item.at), 'yyyy-MM-dd');
      !acc[date] ? (acc[date] = [item]) : (acc[date] = [...acc[date], item]);
      return acc;
    }, {});

    setActivityData(Object.entries(groupedData));
  }, []);

  if (loading) {
    return <StyledSpiner size="large" />;
  }

  return (
    <>
      {activityData.map((item, index) => {
        return (
          <Row key={index} gutter={[16, 16]}>
            <Col span={24}>
              <Card title={cardTitleByDate(item[0])}>
                <List
                  dataSource={item[1]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ backgroundColor: item.subject.defaultAvatar }}>{item.subject.username[0].toUpperCase()}</Avatar>
                        }
                        title={activityTitleByAction(item, streamId)}
                        description={`${formatDistance(new Date(item.at), new Date())} ago`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        );
      })}
      {activityData.length === 0 && <Empty style={{ marginTop: 500 }} description="No Activities Yet" />}
    </>
  );
}

export default Activity;
