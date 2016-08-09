import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import {Paper, RaisedButton} from 'material-ui';

import '../../scss/startup.scss';


class StartUp extends React.Component {
    render() {
        const {done, state} = this.props,
            msg = done ? 'Startup done!' : state,
            onClick = () => hashHistory.push('/pics');

        return <Paper className="startup-paper">
            <div>{msg}</div>
            <RaisedButton
                label="Enter" primary={true} disabled={!done}
                onClick={onClick}
            />
        </Paper>;
    }
}

function mapStateToProps(appState) {
    const {done, state} = appState.ui.startup;
    return {done, state};
}

export default connect(mapStateToProps)(StartUp);
