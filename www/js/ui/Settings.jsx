import React from 'react';
import {connect} from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import {redirect, setConfigUrl} from '../actions';

import '../../scss/settings.scss';


class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {apiDialogOpen: false};
    }

    setRef(component, ref) {
        this[ref] = component;
    }

    toggleState(stateItem) {
        return () => this.setState({[stateItem]: !this.state[stateItem]});
    }

    renderApiServerInputDialog() {
        const actions = [
            <FlatButton
                label="Cancel"
                onTouchTap={this.toggleState('apiDialogOpen')}
            />,
            <FlatButton
                label="Save"
                primary={true}
                onTouchTap={() => {
                    this.props.saveApiServerUrl(this.apiServerInput.getValue());
                    this.toggleState('apiDialogOpen')();
                }}
            />
        ];

        return (
            <Dialog
                title="API Server URL"
                actions={actions}
                modal={true}
                open={this.state.apiDialogOpen}
                onRequestChange={(o) => this.setState({apiDialogOpen: o})}
            >
                <TextField
                    name="api-server-url-input"
                    defaultValue={this.props.apiServerUrl}
                    ref={(c) => this.setRef(c, 'apiServerInput')}
                    fullWidth={true}
                />
            </Dialog>
        );
    }

    render() {
        const
            menuCloseBtn =
                <IconButton onTouchTap={this.props.redirectToPics}>
                    <NavigationArrowBack />
                </IconButton>;

        return <div className="settings-page">
            <AppBar
                title="Settings Kiekie"
                iconElementLeft={menuCloseBtn}
            />
            <div>
                <List>
                    <Subheader>Kiekie Server</Subheader>
                    <ListItem
                        primaryText="API server URL"
                        secondaryText={this.props.apiServerUrl}
                        onTouchTap={this.toggleState('apiDialogOpen')}
                    />
                </List>
            </div>

            {this.renderApiServerInputDialog()}
        </div>;
    }
}


function mapStateToProps(state) {
    return {
        apiServerUrl: state.config.urls.api
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveApiServerUrl: (url) => dispatch(setConfigUrl('api', url)),
        redirectToPics: () => dispatch(redirect('/pics'))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
