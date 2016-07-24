import React from 'react';
import {connect} from 'react-redux';
import {Link, hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Paper from 'material-ui/Paper';

import Pic from './Pic';
import {selectPic} from '../actions';


class PicView extends React.Component {
    buildEmptyView(appBar) {
        const style = {
            height: '100%',
            width: '100%',
            padding: '40px 0',
            textAlign: 'center'
        };

        return (
            <div>
                {appBar}
                <Paper style={style}>
                    <Link to="/">No pic; go back</Link>;
                </Paper>
            </div>
        );
    }

    handleCloseClick() {
        this.props.close();
        hashHistory.push('/');
    }

    handleDeleteClick() {
    }

    handleSaveClick() {
    }

    handleNoteChange() {
    }

    render() {
        const
            {pic} = this.props,
            handleClose = this.handleCloseClick.bind(this),
            closeBtn =
                <IconButton onClick={handleClose}>
                    <NavigationClose/>
                </IconButton>,
            appBar = <AppBar iconElementLeft={closeBtn} />;

        if (!pic) {
            return this.buildEmptyView(appBar);
        }

        return (
            <div>
                {appBar}
                <Pic
                    info={pic}
                    onDeleteClick={this.handleDeleteClick.bind(this)}
                    onSaveClick={this.handleSaveClick.bind(this)}
                    onNoteChange={this.handleNoteChange.bind(this)}
                />
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

function mapDispatchToProps(dispatch) {
    return {
        close: () => dispatch(selectPic(null)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PicView);
