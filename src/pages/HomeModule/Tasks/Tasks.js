import React, {useEffect, useState} from 'react';
import axios from "axios";
import TaskTable from "pages/HomeModule/Tasks/TasksTable";

const Tasks = () => {
    const [photos, setPhotos] = useState([]);

    // Api
    const instance = axios.create({
        baseURL: 'https://picsum.photos/v2/'
    })
    const photosAPI = {
        getPhotos() {
            return instance.get('list?page=2&limit=5')
        }
    }

    useEffect(() => {
        photosAPI.getPhotos()
            .then((res) => {
                setPhotos(res.data)
            })
    }, [setPhotos])


    return (
        <>
            <TaskTable dataImg={photos}/>

        </>
    );
};

export default Tasks;
