import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardMedia from 'material-ui/lib/card/card-media';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';


export default class Pic extends React.Component {
    render() {
        return (
            <Card className="pic">
                <CardMedia><img src={this.props.src} /></CardMedia>
                <CardText>
                    <TextField floatingLabelText="Note" />
                </CardText>
                <CardActions>
                    <FlatButton label="Delete" secondary={true} />
                    <FlatButton label="Save" />
                </CardActions>
            </Card>
        );
    }
}
