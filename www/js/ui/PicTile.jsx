import React, {PropTypes} from 'react';

import {yellow500, red500} from 'material-ui/styles/colors';
import {GridTile} from 'material-ui/GridList';
import AlertError from 'material-ui/svg-icons/alert/error';
import CircularProgress from 'material-ui/CircularProgress';
import ContentSave from 'material-ui/svg-icons/content/save';

import '../../scss/pictile.scss';


export default class PicTile extends React.Component {
    renderIcon() {
        const {isBusy, isSaved, error} = this.props;
        var icon = null;

        if (!isSaved) {
            icon = <ContentSave className="action-icon" color={yellow500} />;
        }

        if (isBusy) {
            icon = <CircularProgress size={0.5} />;
        }

        if (error) {
            icon = <AlertError className="action-icon" color={red500} />;
        }

        return icon;
    }

    render() {
        const {src, onTouchTap} = this.props,
            icon = this.renderIcon();
        var {title} = this.props;

        if (icon) {
            // We need a truthy title for the tile title overlay to display our
            // icon.
            title = title || ' ';
        }

        return (
            <GridTile
                className="pic-tile" onTouchTap={onTouchTap} title={title}
                actionIcon={icon}
            >
                <img src={src} />
            </GridTile>
        );
    }
}

PicTile.propTypes = {
    isSaved: PropTypes.bool.isRequired,
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onTouchTap: PropTypes.func
};
