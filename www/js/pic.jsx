import React from 'react';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


export default class Pic extends React.Component {
    render() {
        const imgSrc = 'data:image/png;base64,' + this.props.src;
        return (
            <Card className="pic">
                <CardMedia><img src={imgSrc} /></CardMedia>
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
