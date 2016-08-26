import React from 'react';

import {yellow500} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentSave from 'material-ui/svg-icons/content/save';

import '../../scss/savebutton.scss';


export default class SaveButton extends React.Component {
    render() {
        const {disabled, onTouchTap} = this.props;

        return (
            <FloatingActionButton
                className="floating-save-btn"
                disabled={disabled}
                onTouchTap={onTouchTap}
            >
                <ContentSave color={yellow500} />
            </FloatingActionButton>
        );
    }
}

SaveButton.propTypes = {
    onTouchTap: React.PropTypes.func.isRequired
};
