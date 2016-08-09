import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import {Paper, RaisedButton} from 'material-ui';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {state} = this.props,
            onClick = () => hashHistory.push('/pics');
        return <Paper className="startup-paper">
            <div>{state}</div>
            <RaisedButton label="Enter" primary={true} onClick={onClick} />
        </Paper>;
    }
}

function mapStateToProps(state) {
    return {
        state: state.ui.startup.state
    };
}

export default connect(mapStateToProps)(StartUp);
