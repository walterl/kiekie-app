import React from 'react';

import {white} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ImagePhotoCamera from 'material-ui/svg-icons/image/photo-camera';


export default class PhotoButton extends React.Component {
    render() {
        return (
            <IconButton onTouchTap={this.props.onTouchTap}>
                <ImagePhotoCamera color={white} />
            </IconButton>
        );
    }
}

PhotoButton.propTypes = {
    onTouchTap: React.PropTypes.func.isRequired
};
