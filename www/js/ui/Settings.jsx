import React from 'react';
import {connect} from 'react-redux';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import {redirect, setConfigSetting, setConfigUrl} from '../actions';

import '../../scss/settings.scss';


class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {apiDialogOpen: false, picSizeDialogOpen: false};
    }

    setRef(component, ref) {
        this[ref] = component;
    }

    toggleState(stateItem) {
        return () => this.setState({[stateItem]: !this.state[stateItem]});
    }

    renderCancelButton(showStateItem) {
        return <FlatButton
            label="Cancel"
            onTouchTap={this.toggleState(showStateItem)}
        />;
    }

    renderSaveButton(showStateItem, fnSave) {
        return <FlatButton
            label="Save"
            primary={true}
            onTouchTap={() => {
                fnSave();
                this.toggleState(showStateItem)();
            }}
        />;
    }

    renderActions(showStateItem, fnSave) {
        return [this.renderCancelButton(showStateItem),
                this.renderSaveButton(showStateItem, fnSave)];
    }

    renderApiServerInputDialog() {
        const actions = this.renderActions(
            'apiDialogOpen',
            () => this.props.saveApiServerUrl(this.apiServerInput.getValue())
        );

        return (
            <Dialog
                title="API server URL"
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

    renderPicSizeDialog() {
        const actions = this.renderActions(
            'picSizeDialogOpen',
            () => this.props.savePicMaxSize(this.picSizeInput.getValue())
        );

        return (
            <Dialog
                title="Maximum picture dimention size (px)"
                actions={actions}
                modal={true}
                open={this.state.picSizeDialogOpen}
                onRequestChange={(o) => this.setState({picSizeDialogOpen: o})}
            >
                <TextField
                    name="pic-size-input"
                    type="number"
                    defaultValue={this.props.picMaxSize}
                    ref={(c) => this.setRef(c, 'picSizeInput')}
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
                <Divider/>
                <List>
                    <Subheader>Photo Resizing</Subheader>
                    <ListItem
                        primaryText="Maximum picture dimention size (px)"
                        secondaryText={this.props.picMaxSize}
                        onTouchTap={this.toggleState('picSizeDialogOpen')}
                    />
                </List>
            </div>

            {this.renderApiServerInputDialog()}
            {this.renderPicSizeDialog()}
        </div>;
    }
}


function mapStateToProps(state) {
    return {
        apiServerUrl: state.config.urls.api,
        picMaxSize: state.config.picMaxSize
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveApiServerUrl: (url) => dispatch(setConfigUrl('api', url)),
        savePicMaxSize: (sz) => dispatch(setConfigSetting('picMaxSize', sz)),
        redirectToPics: () => dispatch(redirect('/pics'))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
