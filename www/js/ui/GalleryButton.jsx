import React from 'react';

import {white} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ImagePhotoLibrary from 'material-ui/svg-icons/image/photo-library';


export default class GalleryButton extends React.Component {
    render() {
        return (
            <IconButton onTouchTap={this.props.onTouchTap}>
                <ImagePhotoLibrary color={white} />
            </IconButton>
        );
    }
}

GalleryButton.propTypes = {
    onTouchTap: React.PropTypes.func.isRequired
};
