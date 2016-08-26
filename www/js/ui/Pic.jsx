import React, {PropTypes} from 'react';

import {darkWhite} from 'material-ui/styles/colors';
import Card from 'material-ui/Card/Card';
import CardMedia from 'material-ui/Card/CardMedia';
import TextField from 'material-ui/TextField';


export default class Pic extends React.Component {
    render() {
        const {note, uri, onNoteChange} = this.props,
            textField = <TextField
                floatingLabelText="Note" multiLine={true}
                value={note}
                onChange={onNoteChange}

                style={{maxWidth: 'calc(100% - 80px)'}}
                floatingLabelStyle={{color: darkWhite}}
                textareaStyle={{color: darkWhite}}
            />;
        return (
            <Card className="pic">
                <CardMedia overlay={textField} >
                    <img src={uri} />
                </CardMedia>
            </Card>
        );
    }
}

Pic.propTypes = {
    note: PropTypes.string.isRequired,
    uri: PropTypes.string,
    onNoteChange: PropTypes.func.isRequired
};
