import React from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';

import PicsList from './PicsList';
import PhotoButton from './PhotoButton';

import {receivePic, takePhoto} from '../actions';

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
        var {onCameraClick} = this.props,
            photoButton = null;
        const {debug, dispatch} = this.props;

        if (debug) {
            onCameraClick = () =>
                dispatch(receivePic(nextDebugPic(), Date.now()));
        }
        photoButton = <PhotoButton onClick={onCameraClick} />;

        return (
            <div>
                <AppBar
                    title="SnapHappy"
                    iconElementRight={photoButton}
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
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
