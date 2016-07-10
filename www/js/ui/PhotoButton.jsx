import React from 'react';
import {connect} from 'react-redux';

import IconButton from 'material-ui/IconButton';
import ImagePhotoCamera from 'material-ui/svg-icons/image/photo-camera';

import {takePhoto} from '../actions';


class PhotoButton extends React.Component {
    render() {
        return (
            <IconButton onClick={this.props.onClick}>
                <ImagePhotoCamera color="white" />
            </IconButton>
        );
    }
}

PhotoButton.propTypes = {
    onClick: React.PropTypes.func.isRequired
};

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        onClick: () => dispatch(takePhoto())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoButton);
