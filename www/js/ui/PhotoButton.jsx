import React from 'react';
import {connect} from 'react-redux';

import IconButton from 'material-ui/IconButton';
import ImagePhotoCamera from 'material-ui/svg-icons/image/photo-camera';

import {receivePic, takePhoto} from '../actions';


var debugPic = 0;

/**
 * Cycle through `1.jpg` through `5.jpg` in the `ignoreme` directory.
 */
function nextDebugPic() {
    debugPic = debugPic % 5 + 1;
    return `/ignoreme/${debugPic}.jpg`;
}


class PhotoButton extends React.Component {
    render() {
        var onClick = this.props.onClick;
        if (this.props.debug) {
            onClick = () =>
                this.props.dispatch(receivePic(nextDebugPic(), Date.now()));
        }
        return (
            <IconButton onClick={onClick}>
                <ImagePhotoCamera color="white" />
            </IconButton>
        );
    }
}

PhotoButton.propTypes = {
    debug: React.PropTypes.bool,
    onClick: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
        debug: state.config.debug
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onClick: () => dispatch(takePhoto()),
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoButton);
