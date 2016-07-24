import React, {PropTypes} from 'react';

import Card from 'material-ui/Card/Card';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import TextField from 'material-ui/TextField';


export default class Pic extends React.Component {
    render() {
        const {info, onNoteChange} = this.props;
        return (
            <Card className="pic">
                <CardMedia><img src={info.data} /></CardMedia>
                <CardText>
                    <TextField
                        floatingLabelText="Note" multiLine={true}
                        onBlur={onNoteChange}
                    />
                </CardText>
            </Card>
        );
    }
}

Pic.propTypes = {
    info: PropTypes.object.isRequired,
    onNoteChange: PropTypes.func.isRequired
};
