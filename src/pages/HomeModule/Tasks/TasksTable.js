import {Avatar, Table, Tag, Tooltip} from "antd";
import {AntDesignOutlined, ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, UserOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import style from "./Tasks.module.scss";


const TaskTable = () => {
    const [photo, setPhoto] = useState([]);

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
    const data = [
        {
            key: '1',
            title: 'Upon completion of KYC process and post-IMA negotiations...',
            priority: <>
                <ArrowUpOutlined style={{color: '#f4222d'}}/>High
            </>,
            date: 'Today - 24 Dec',
            assignee: <Avatar.Group maxCount={3}>
                <Avatar src="https://joeschmoe.io/api/v1/random"/>

            </Avatar.Group>,
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
            assignee: <Avatar.Group>
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
                <Avatar src="https://d5nunyagcicgy.cloudfront.net/external_assets/hero_examples/hair_beach_v391182663/original.jpeg"/>
            </Avatar.Group>,
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
            assignee: <Avatar.Group maxCount={3}>
                <Avatar src="https://cdn.searchenginejournal.com/wp-content/uploads/2022/04/reverse-image-search-627b7e49986b0-sej-760x400.png"/>
                <Avatar style={{backgroundColor: '#f56a00'}}>K</Avatar>
                <Tooltip title="Ant User" placement="top">
                    <Avatar src="https://img.freepik.com/premium-photo/astronaut-outer-open-space-planet-earth-stars-provide-background-erforming-space-planet-earth-sunrise-sunset-our-home-iss-elements-this-image-furnished-by-nasa_150455-16829.jpg?w=2000"/>
                </Tooltip>
                <Avatar style={{backgroundColor: '#1890ff'}} icon={<AntDesignOutlined/>}/>
            </Avatar.Group>,
            tags: ['To do'],
        },
        {
            key: '4',
            title: 'Confirm fee scale or rebate and confirm agreed by FC',
            priority: <>
                <ArrowDownOutlined style={{color: '#4bb318'}}/>Low
            </>,
            date: '13 Aug, 2020',
            assignee: <Avatar.Group>
                <Avatar style={{backgroundColor: '#f56a00'}}>Andrey</Avatar>
                <Tooltip title="Ant User" placement="top">
                    <Avatar style={{backgroundColor: '#87d068'}} icon={<UserOutlined/>}/>
                </Tooltip>
            </Avatar.Group>,
            tags: ['To do'],
        },
        {
            key: '5',
            title: 'Compliance to sign-off AML',
            priority: <>
                <ArrowDownOutlined style={{color: '#4bb318'}}/>Low
            </>,
            date: '27 Jul, 2020',
            assignee: <Avatar.Group>
                <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd58judYx225Niz5uRBaJc1UJi4DFHjOZNJA&usqp=CAU"/>
            </Avatar.Group>,
            tags: ['in progress'],
        },
        {
            key: '6',
            title: 'Compliance to complete searches for adverse media in relation...',
            priority: <>
                <ArrowUpOutlined style={{color: '#f50000'}}/>High
            </>,
            date: '19 Jul, 2020',
            assignee: <Avatar.Group>
                <Avatar src="https://joeschmoe.io/api/v1/random"/>
                <Avatar src="https://www.esafety.gov.au/sites/default/files/2019-08/Remove%20images%20and%20video.jpg"></Avatar>
            </Avatar.Group>,
            tags: ['Done'],
        },
    ];

    return (
        <div className={style.taskTable}>
            <Table columns={columns} dataSource={data} pagination={false}/>
        </div>
    );
};

export default TaskTable;
