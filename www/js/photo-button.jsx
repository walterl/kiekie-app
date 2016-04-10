import React from 'react';

import IconButton from 'material-ui/lib/icon-button';
import ImagePhotoCamera from 'material-ui/lib/svg-icons/image/photo-camera';


export default class PhotoButton extends React.Component {
    render() {
        return (
            <IconButton onClick={this.props.handler}>
                <ImagePhotoCamera color="white" />
            </IconButton>
        );
    }
}
