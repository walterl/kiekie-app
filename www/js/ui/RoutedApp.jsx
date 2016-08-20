import React from 'react';
import {Router, Route, hashHistory} from 'react-router';

import Pics from './Pics';
import PicView from './PicView';
import Login from './Login';
import StartUp from './StartUp';


export default class RoutedApp extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={StartUp} />
                <Route path="/login" component={Login} />
                <Route path="/pics" component={Pics} />
                <Route path="/pic/:picId" component={PicView} />
            </Router>
        );
    }
}
