/* global cordova */
import React from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';

import PicsList from './PicsList';
import GalleryButton from './GalleryButton';
import PhotoButton from './PhotoButton';
import SaveButton from './SaveButton';

import {receivePic, requestPic, saveAllPics} from '../actions';
import {nextDebugPic} from '../lib';

import '../../scss/pics.scss';


class Pics extends React.Component {
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
                    iconElementRight={actions}
                    className="appbar"
                    showMenuIconButton={false}
                />
                <PicsList />
            </div>
        );
    }
}


Pics.propTypes = {
    onCameraClick: React.PropTypes.func.isRequired,
    onGalleryClick: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        allPicsSaved: state.pics.every((pic) => pic.saved)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addDebugPic: () => nextDebugPic().then(
            (uri) => dispatch(receivePic(uri))),
        onCameraClick: () => dispatch(requestPic()),
        onGalleryClick: () => dispatch(requestPic('gallery')),
        onSaveClick: () => dispatch(saveAllPics())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Pics);
