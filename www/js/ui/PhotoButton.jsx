import React from 'react';

import IconButton from 'material-ui/IconButton';
import ImagePhotoCamera from 'material-ui/svg-icons/image/photo-camera';


export default class PhotoButton extends React.Component {
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
