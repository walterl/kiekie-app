import React from 'react';

import {yellow500} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentSave from 'material-ui/svg-icons/content/save';

import '../../scss/savebutton.scss';


export default class SaveButton extends React.Component {
    render() {
        const {disabled, onTouchTap} = this.props,
            tooltip = this.props.tooltip || 'Save picture';

        return (
            <FloatingActionButton
                className="floating-save-btn"
                tooltip={tooltip} disabled={disabled}
                onTouchTap={onTouchTap}
            >
                <ContentSave color={yellow500} />
            </FloatingActionButton>
        );
    }
}

SaveButton.propTypes = {
    tooltip: React.PropTypes.string,
    onTouchTap: React.PropTypes.func.isRequired
};
