import React from 'react';
import {Router, Route, hashHistory} from 'react-router';

import App from './App';
import PicView from './PicView';


export default class RoutedApp extends React.Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={App} />
                <Route path="/pic/:picId" component={PicView} />
            </Router>
        );
    }
}
