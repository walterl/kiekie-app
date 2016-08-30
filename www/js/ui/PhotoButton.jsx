import React from 'react';

import {white} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ImageAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';

import '../../scss/photobutton.scss';


export default class PhotoButton extends React.Component {
    render() {
        return (
            <FloatingActionButton
                className="photo-btn"
                onTouchTap={this.props.onTouchTap}
            >
                <ImageAddAPhoto color={white} />
            </FloatingActionButton>
        );
    }
}

PhotoButton.propTypes = {
    onTouchTap: React.PropTypes.func.isRequired
};
