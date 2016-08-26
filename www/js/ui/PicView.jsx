import React from 'react';
import {connect} from 'react-redux';
import {Link, hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import {white} from 'material-ui/styles/colors';

import Pic from './Pic';
import SaveButton from './FloatingSaveButton';

import {
    cancelDeletePic, deletePic, confirmDeletePic, setNote, savePic,
    selectPic
} from '../actions';


class PicView extends React.Component {
    constructor(props) {
        super(props);

        this.handleCloseClick = this.handleCloseClick.bind(this);
        this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
    }

    renderAppBar() {
        const {pic} = this.props,
            saveBtn = <SaveButton onTouchTap={this.props.savePic} />;

        return <AppBar
            iconElementLeft={this.renderCloseButton()}
            iconElementRight={<div>
                {this.renderDeleteButton()}
                {pic && pic.saved ? null : saveBtn}
            </div>}
        />;
    }

    renderCloseButton() {
        return (
            <IconButton onTouchTap={this.handleCloseClick}>
                <NavigationArrowBack/>
            </IconButton>
        );
    }

    renderDeleteButton() {
        return (
            <IconButton
                onTouchTap={this.props.confirmDeletePic}
                tooltip="Delete picture"
            >
                <ActionDelete color={white} />
            </IconButton>
        );
    }

    renderEmptyView() {
        const style = {
            height: '100%',
            width: '100%',
            padding: '40px 0',
            textAlign: 'center'
        };

        return (
            <div>
                <AppBar iconElementLeft={this.renderCloseButton()} />
                <Paper style={style}>
                    No picture here. <Link to="/">Go back</Link>.
                </Paper>
            </div>
        );
    }

    renderDeleteDialog() {
        if (!this.props.pic.confirmDelete) {
            return null;
        }

        const
            actions = [
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onTouchTap={() => this.props.cancelDeletePic()}
                />,
                <FlatButton
                    label="Delete"
                    primary={true}
                    onTouchTap={this.handleDeleteConfirm}
                />
            ];

        return (
            <Dialog
                title="Delete picture"
                actions={actions}
                modal={true}
                open={this.props.pic.confirmDelete}
                onRequestClose={() => this.props.cancelDeletePic()}
            >
                Are you sure you want to delete this picture?
            </Dialog>
        );
    }

    handleCloseClick() {
        this.props.close();
        hashHistory.goBack();
    }

    handleDeleteConfirm() {
        this.props.deletePic();
        hashHistory.goBack();
    }

    handleNoteChange(event) {
        this.props.noteChanged(event.target.value);
    }

    render() {
        const {pic} = this.props;

        if (!pic) {
            return this.renderEmptyView();
        }

        return (
            <div>
                {this.renderAppBar()}
                <Pic
                    uri={pic.uri} note={pic.note} isLoading={pic.busy}
                    error={pic.error}
                    onNoteChange={this.handleNoteChange}
                />
                {this.renderDeleteDialog()}
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
        confirmDeletePic: () => dispatch(confirmDeletePic(picId)),
        noteChanged: (newValue) => dispatch(setNote(picId, newValue)),
        savePic: () => dispatch(savePic(picId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PicView);
