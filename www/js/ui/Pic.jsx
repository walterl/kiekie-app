import React, {PropTypes} from 'react';

import Card from 'material-ui/Card/Card';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import TextField from 'material-ui/TextField';


export default class Pic extends React.Component {
    render() {
        const {note, uri, onNoteChange} = this.props;
        return (
            <Card className="pic">
                <CardMedia><img src={uri} /></CardMedia>
                <CardText>
                    <TextField
                        floatingLabelText="Note" multiLine={true}
                        value={note}
                        onChange={onNoteChange}
                    />
                </CardText>
            </Card>
        );
    }
}

Pic.propTypes = {
    note: PropTypes.string.isRequired,
    uri: PropTypes.string,
    onNoteChange: PropTypes.func.isRequired
};
