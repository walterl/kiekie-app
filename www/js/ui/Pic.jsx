import React, {PropTypes} from 'react';

import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


export default class Pic extends React.Component {
    render() {
        const
            imgSrc = 'data:image/png;base64,' + this.props.src,
            {saved, onDeleteClick, onSaveClick, onNoteChange} = this.props;
        return (
            <Card className="pic">
                <CardMedia><img src={imgSrc} /></CardMedia>
                <CardText>
                    <TextField
                        floatingLabelText="Note" multiLine={true}
                        onBlur={onNoteChange}
                    />
                </CardText>
                <CardActions>
                    <FlatButton
                        label="Delete" secondary={true}
                        onClick={onDeleteClick}
                    />
                    <FlatButton
                        label="Save" disabled={saved}
                        onClick={onSaveClick}
                    />
                </CardActions>
            </Card>
        );
    }
}

Pic.propTypes = {
    src: PropTypes.string.isRequired,
    saved: PropTypes.bool,
    onDeleteClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onNoteChange: PropTypes.func.isRequired
};
