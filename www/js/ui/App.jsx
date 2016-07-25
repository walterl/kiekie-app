import React from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';

import PicsList from './PicsList';
import GalleryButton from './GalleryButton';
import PhotoButton from './PhotoButton';

import {importPhotoFromGallery, receivePic, takePhoto} from '../actions';

import '../../scss/app.scss';


var debugPic = 0;

/**
 * Cycle through `1.jpg` through `5.jpg` in the `ignoreme` directory.
 */
function nextDebugPic() {
    debugPic = debugPic % 5 + 1;
    return `/ignoreme/${debugPic}.jpg`;
}


class App extends React.Component {
    render() {
        var {onCameraClick, onGalleryClick} = this.props,
            actions = null;
        const {debug, dispatch} = this.props;

        if (debug) {
            onCameraClick = onGalleryClick = () =>
                dispatch(receivePic(nextDebugPic(), Date.now()));
        }
        actions = <div>
            <GalleryButton onClick={onGalleryClick} />
            <PhotoButton onClick={onCameraClick} />
        </div>;

        return (
            <div>
                <AppBar
                    title="SnapHappy"
                    iconElementRight={actions}
                    className="appbar"
                    showMenuIconButton={false}
                />
                <PicsList />
            </div>
        );
    }
}


App.propTypes = {
    debug: React.PropTypes.bool,
    dispatch: React.PropTypes.func.isRequired,
    onCameraClick: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        debug: state.config.debug
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onCameraClick: () => dispatch(takePhoto()),
        onGalleryClick: () => dispatch(takePhoto('gallery')),
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
