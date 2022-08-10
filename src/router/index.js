import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Documents from 'pages/HomeModule/Documents/Documents';
import HomeLayout from 'pages/HomeModule/HomeLayout';
import StreamPage from 'pages/HomeModule/Stream';
import UsersPage from 'pages/HomeModule/Users';
import UserPage from 'pages/HomeModule/Users/UserPage';
import ViewerPage from 'pages/HomeModule/Viewer/index';
import RedirectPage from 'pages/HomeModule/RedirectPage';
import Tasks from "pages/HomeModule/Tasks/Tasks";

const Router = () => {
    // const userFromState = useSelector((state) => state.auth.user);

    // if (!userFromState) {
    //   return <Redirect to="/login" />;
    // }

    return (
        <Switch>
            <Route
                exact
                path="/"
                component={() => (
                    <HomeLayout>
                        <RedirectPage/>
                    </HomeLayout>
                )}
            />
            <Route
                exact
                path="/documents"
                component={() => (
                    <HomeLayout>
                        <Documents/>
                    </HomeLayout>
                )}
            />
            <Route
                exact
                path="/tasks"
                component={() => (
                    <HomeLayout>
                        <Tasks/>
                    </HomeLayout>
                )}
            />
            <Route
                exact
                path="/users"
                component={() => (
                    <HomeLayout>
                        <UsersPage/>
                    </HomeLayout>
                )}
            />
            <Route
                exact
                path="/users/:id"
                component={() => (
                    <HomeLayout>
                        <UserPage/>
                    </HomeLayout>
                )}
            />
            <Route
                exact
                path="/streams/:id"
                component={() => (
                    <HomeLayout>
                        <StreamPage/>
                    </HomeLayout>
                )}
            />
            <Route exact path="/viewer" component={ViewerPage}/>
            <Redirect from="**" to="/"/>
        </Switch>
    );
};

export default Router;
