/* global cordova */
import React from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';

import PicsList from './PicsList';
import GalleryButton from './GalleryButton';
import MenuButton from './Menu';
import PhotoButton from './PhotoButton';
import SaveButton from './SaveButton';

import {receivePic, redirect, requestPic, saveAllPics} from '../actions';
import {nextDebugPic} from '../lib';

import '../../scss/pics.scss';


class Pics extends React.Component {
    renderMenuButton() {
        const {userName, onMenuAboutClick, onMenuSettingsClick} = this.props;

        return <MenuButton
            userName={userName}
            onAboutClick={onMenuAboutClick}
            onSettingsClick={onMenuSettingsClick}
        />;
    }

    render() {
        const {allPicsSaved} = this.props;
        var {onCameraClick, onGalleryClick, onSaveClick} = this.props,
            actions = null;

        if (cordova.isBrowser) {
            onCameraClick = onGalleryClick = this.props.addDebugPic;
        }

        actions = <div>
            <SaveButton
                tooltip={"Save all pictures"} disabled={allPicsSaved}
                onTouchTap={onSaveClick}
            />
            <GalleryButton onTouchTap={onGalleryClick} />
            <PhotoButton onTouchTap={onCameraClick} />
        </div>;

        return (
            <div>
                <AppBar
                    title="Kiekie"
                    iconElementLeft={this.renderMenuButton()}
                    iconElementRight={actions}
                    className="appbar"
                />
                <PicsList />
            </div>
        );
    }
}


Pics.propTypes = {
    allPicsSaved: React.PropTypes.bool.isRequired,

    addDebugPic: React.PropTypes.func.isRequired,
    onCameraClick: React.PropTypes.func.isRequired,
    onGalleryClick: React.PropTypes.func.isRequired,
    onMenuAboutClick: React.PropTypes.func.isRequired,
    onMenuSettingsClick: React.PropTypes.func.isRequired,
    onSaveClick: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        allPicsSaved: state.pics.every((pic) => pic.saved),
        userName: state.server.userName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addDebugPic: () => nextDebugPic().then(
            (uri) => dispatch(receivePic(uri))),
        onCameraClick: () => dispatch(requestPic()),
        onGalleryClick: () => dispatch(requestPic('gallery')),
        onMenuAboutClick: () => dispatch(redirect('/about')),
        onMenuSettingsClick: () => dispatch(redirect('/settings')),
        onSaveClick: () => dispatch(saveAllPics())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pics);
