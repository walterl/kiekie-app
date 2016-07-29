/* global cordova */
import React from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';

import PicsList from './PicsList';
import GalleryButton from './GalleryButton';
import PhotoButton from './PhotoButton';

import {processPic, requestPic} from '../actions';

import '../../scss/app.scss';


var browserPic = 0;

/**
 * Cycle through `1.jpg` through `5.jpg` in the `ignoreme` directory.
 */
function nextDebugPic() {
    browserPic = browserPic % 5 + 1;
    return `/ignoreme/${browserPic}.jpg`;
}


class App extends React.Component {
    render() {
        var {onCameraClick, onGalleryClick} = this.props,
            actions = null;
        const {dispatch} = this.props;

        if (cordova.platformId === 'browser') {
            onCameraClick = onGalleryClick = () =>
                dispatch(processPic(nextDebugPic(), Date.now()));
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
    dispatch: React.PropTypes.func.isRequired,
    onCameraClick: React.PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
    return {
        onCameraClick: () => dispatch(requestPic()),
        onGalleryClick: () => dispatch(requestPic('gallery')),
        dispatch
    };
}

export default connect(null, mapDispatchToProps)(App);
