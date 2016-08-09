import React from 'react';
import {hashHistory} from 'react-router';

import {RaisedButton} from 'material-ui';


export default class StartUp extends React.Component {
    render() {
        const onClick = () => hashHistory.push('/pics');
        return <RaisedButton label="Enter" primary={true} onClick={onClick} />;
    }
}
