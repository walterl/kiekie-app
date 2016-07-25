import React from 'react';

import {white} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';


export default class GalleryButton extends React.Component {
    render() {
        return (
            <IconButton onClick={this.props.onClick}>
                <ImagePhotoLibrary color={white} />
            </IconButton>
        );
    }
}

GalleryButton.propTypes = {
    onClick: React.PropTypes.func.isRequired
};
