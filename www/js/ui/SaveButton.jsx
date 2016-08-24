import React from 'react';

import {yellow500} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ContentSave from 'material-ui/svg-icons/content/save';


export default class SaveButton extends React.Component {
    render() {
        const {disabled, onTouchTap} = this.props,
            tooltip = this.props.tooltip || 'Save picture';

        return (
            <IconButton
                tooltip={tooltip} disabled={disabled}
                onTouchTap={onTouchTap}
            >
                <ContentSave color={yellow500} />
            </IconButton>
        );
    }
}

SaveButton.propTypes = {
    disabled: React.PropTypes.bool.isRequired,
    tooltip: React.PropTypes.string,
    onTouchTap: React.PropTypes.func.isRequired
};
