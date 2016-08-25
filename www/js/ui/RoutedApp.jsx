import React from 'react';
import {Router, Route, hashHistory} from 'react-router';

import About from './About';
import Pics from './Pics';
import PicView from './PicView';
import Login from './Login';
import StartUp from './StartUp';
import Settings from './Settings';


export default class RoutedApp extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={StartUp} />
                <Route path="/login" component={Login} />
                <Route path="/pics" component={Pics} />
                <Route path="/pic/:picId" component={PicView} />
                <Route path="/settings" component={Settings} />
                <Route path="/about" component={About} />
            </Router>
        );
    }
}
