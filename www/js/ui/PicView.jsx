import React from 'react';
import {connect} from 'react-redux';
import {Link, hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentSave from 'material-ui/svg-icons/content/save';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {white} from 'material-ui/styles/colors';

import Pic from './Pic';
import {
    cancelDeletePic, deletePic, requestDeletePic, setNote, savePic,
    selectPic
} from '../actions';


class PicView extends React.Component {
    buildCloseButton() {
        return (
            <IconButton onClick={this.handleCloseClick.bind(this)}>
                <NavigationClose/>
            </IconButton>
        );
    }

    buildEmptyView() {
        const style = {
            height: '100%',
            width: '100%',
            padding: '40px 0',
            textAlign: 'center'
        };

        return (
            <div>
                <AppBar iconElementLeft={this.buildCloseButton()} />
                <Paper style={style}>
                    No picture here. <Link to="/">Go back</Link>.
                </Paper>
            </div>
        );
    }

    buildDeleteDialog() {
        if (!this.props.pic.confirmDelete) {
            return null;
        }

        const
            handleDeleteClose = this.handleDeleteClose.bind(this),
            actions = [
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onClick={handleDeleteClose}
                />,
                <FlatButton
                    label="Delete"
                    primary={true}
                    onClick={this.handleDeleteConfirm.bind(this)}
                />
            ];

        return (
            <Dialog
                title="Delete picture"
                actions={actions}
                modal={true}
                open={this.props.pic.confirmDelete}
                onRequestClose={handleDeleteClose}
            >
                Are you sure you want to delete this picture?
            </Dialog>
        );
    }

    handleCloseClick() {
        this.props.close();
        hashHistory.push('/');
    }

    handleDeleteClick() {
        this.props.requestDeletePic();
    }

    handleDeleteClose() {
        this.props.cancelDeletePic();
    }

    handleDeleteConfirm() {
        this.props.deletePic();
        hashHistory.push('/');
    }

    handleSaveClick() {
        this.props.savePic();
    }

    handleNoteChange(event) {
        this.props.noteChanged(event.target.value);
    }

    render() {
        const
            {pic} = this.props,
            actions = <div>
                <IconButton
                    onClick={this.handleDeleteClick.bind(this)}
                    tooltip="Delete picture"
                >
                    <ActionDelete color={white} />
                </IconButton>
                <IconButton
                    onClick={this.handleSaveClick.bind(this)}
                    tooltip="Save picture"
                    disabled={pic ? pic.saved : true}
                >
                    <ContentSave color={white} />
                </IconButton>
            </div>,
            appBar = <AppBar
                iconElementLeft={this.buildCloseButton()}
                iconElementRight={actions}
            />;

        if (!pic) {
            return this.buildEmptyView();
        }

        return (
            <div>
                {appBar}
                <Pic
                    uri={pic.uri} note={pic.note}
                    onNoteChange={this.handleNoteChange.bind(this)}
                />
                {this.buildDeleteDialog()}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const {picId} = ownProps.params;
    var selected = state.pics.filter((p) => p.id === picId),
        pic = selected.length ? selected[0] : null;
    return {pic};
}

function mapDispatchToProps(dispatch, ownProps) {
    const {picId} = ownProps.params;
    return {
        close: () => dispatch(selectPic(null)),
        cancelDeletePic: () => dispatch(cancelDeletePic(picId)),
        deletePic: () => dispatch(deletePic(picId)),
        requestDeletePic: () => dispatch(requestDeletePic(picId)),
        noteChanged: (newValue) => dispatch(setNote(picId, newValue)),
        savePic: () => dispatch(savePic(picId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PicView);
