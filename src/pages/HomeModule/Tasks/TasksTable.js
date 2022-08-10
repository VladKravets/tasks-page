import {Avatar, Table, Tag, Tooltip} from "antd";
import {AntDesignOutlined, ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, UserOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import style from "./Tasks.module.scss";

const data = [
    {
        key: '1',
        title: 'Upon completion of KYC process and post-IMA negotiations...',
        priority: <>
            <ArrowUpOutlined style={{color: '#f4222d'}}/>High
        </>,
        date: 'Today - 24 Dec',
        assignee: null,
        tags: ['in progress'],

    },
    {
        key: '2',
        title: 'Complete product governance checklist',
        priority: <>
            <MinusOutlined style={{color: '#6d6d6d'}}/>Normal
        </>
        ,
        date: 'Today - 06 Jan',
        assignee: null,
        tags: ['Done'],
    },
    {
        key: '3',
        title: 'Present to fee committee (FC) and confirm approval',
        priority: <>
            <MinusOutlined style={{color: '#6d6d6d'}}/>Normal
        </>
        ,
        date: '21 Aug, 2020',
        assignee:null,
        tags: ['To do'],
    },
    {
        key: '4',
        title: 'Confirm fee scale or rebate and confirm agreed by FC',
        priority: <>
            <ArrowDownOutlined style={{color: '#4bb318'}}/>Low
        </>,
        date: '13 Aug, 2020',
        assignee:null,
        tags: ['To do'],
    },
    {
        key: '5',
        title: 'Compliance to sign-off AML',
        priority: <>
            <ArrowDownOutlined style={{color: '#4bb318'}}/>Low
        </>,
        date: '27 Jul, 2020',
        assignee: null,
        tags: ['in progress'],
    },
    {
        key: '6',
        title: 'Compliance to complete searches for adverse media in relation...',
        priority: <>
            <ArrowUpOutlined style={{color: '#f50000'}}/>High
        </>,
        date: '19 Jul, 2020',
        assignee: null,
        tags: ['Done'],
    },
];
const columns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        render: (text) => <p>{text}</p>,
    },
    {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
    },
    {
        title: 'Due Date',
        dataIndex: 'date',
        key: 'date',
    },

    {
        title: 'Assignee',
        dataIndex: 'assignee',
        key: 'assignee',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (_, {tags}) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';

                    if (tag === 'To do') {
                        color = '';
                    }

                    return (
                        <Tag color={color} key={tag}>
                            {tag}
                        </Tag>
                    );
                })}
            </>
        ),
    },
];
const TaskTable = ({dataImg}) => {

    const mappedData = data.map((el, i) => {
        if (dataImg[i]) {
            return {
                ...el,
                assignee: <Avatar src={dataImg[i].download_url}/>
            }
        }

        return el
    })

    return (
        <div className={style.taskTable}>
            <Table columns={columns} dataSource={mappedData} pagination={false}/>
        </div>
    );
};

export default TaskTable;
