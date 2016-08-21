/* global cordova */
import React from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';

import PicsList from './PicsList';
import GalleryButton from './GalleryButton';
import PhotoButton from './PhotoButton';

import {receivePic, requestPic} from '../actions';
import {nextDebugPic} from '../lib';

import '../../scss/pics.scss';


class Pics extends React.Component {
    render() {
        var {onCameraClick, onGalleryClick} = this.props,
            actions = null;

        if (cordova.isBrowser) {
            onCameraClick = onGalleryClick = this.props.addDebugPic;
        }

        actions = <div>
            <GalleryButton onClick={onGalleryClick} />
            <PhotoButton onClick={onCameraClick} />
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
    onCameraClick: React.PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        addDebugPic: () => dispatch(receivePic(nextDebugPic(), Date.now())),
        onCameraClick: () => dispatch(requestPic()),
        onGalleryClick: () => dispatch(requestPic('gallery'))
    };
}

export default connect(null, mapDispatchToProps)(Pics);
