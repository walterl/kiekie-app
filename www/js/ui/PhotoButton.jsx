import React from 'react';

import {white} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ImagePhotoCamera from 'material-ui/svg-icons/image/photo-camera';

import '../../scss/photobutton.scss';


export default class PhotoButton extends React.Component {
    render() {
        return (
            <FloatingActionButton
                className="photo-btn"
                onTouchTap={this.props.onTouchTap}
            >
                <ImagePhotoCamera color={white} />
            </FloatingActionButton>
        );
    }
}

PhotoButton.propTypes = {
    onTouchTap: React.PropTypes.func.isRequired
};
