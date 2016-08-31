import React from 'react';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import {setConfigSetting, setConfigUrl} from '../actions';

import ErrorBar from './ErrorBar';
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

    renderApiUrlDialog() {
        const actions = this.renderActions(
            'apiDialogOpen',
            () => {
                let url = this.apiUrlInput.getValue();
                if (!url.endsWith('/')) {
                    url += '/';
                }

                if (url === this.props.apiUrl) {
                    return;
                }

                this.props.saveApiUrl(url);
            }
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
                    name="api-url-input"
                    type="url"
                    defaultValue={this.props.apiUrl}
                    ref={(c) => this.setRef(c, 'apiUrlInput')}
                    fullWidth={true}
                />
            </Dialog>
        );
    }

    renderPicSizeDialog() {
        const actions = this.renderActions(
            'picSizeDialogOpen',
            () => {
                const newValue = parseInt(this.picSizeInput.getValue(), 10);
                if (newValue !== this.props.picMaxSize) {
                    this.props.savePicMaxSize(newValue);
                }
            }
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

    renderUrlTestDialog() {
        const textStyle = {
                height: '50px',
                lineHeight: '50px',
                verticalAlign: 'text-bottom'
            },
            progressStyle = {
                display: 'block',
                margin: '10px auto'
            };

        return (
            <Dialog
                title="API server URL"
                modal={true}
                open={this.props.testingApiUrl}
            >
                <div style={textStyle}>Checking API URL...</div>
                <CircularProgress style={progressStyle} />
            </Dialog>
        );
    }

    render() {
        const
            menuCloseBtn =
                <IconButton onTouchTap={() => hashHistory.goBack()}>
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
                        secondaryText={this.props.apiUrl}
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

            {this.renderApiUrlDialog()}
            {this.renderPicSizeDialog()}
            {this.renderUrlTestDialog()}

            <ErrorBar />
        </div>;
    }
}


function mapStateToProps(state) {
    return {
        apiUrl: state.config.urls.api,
        picMaxSize: state.config.picMaxSize,
        testingApiUrl: state.ui.settings.testingApiUrl
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveApiUrl: (url) => dispatch(setConfigUrl('api', url)),
        savePicMaxSize: (sz) => dispatch(setConfigSetting('picMaxSize', sz))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
