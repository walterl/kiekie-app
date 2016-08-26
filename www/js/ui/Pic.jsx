import React, {PropTypes} from 'react';

import Card from 'material-ui/Card/Card';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';


export default class Pic extends React.Component {
    renderCardMedia() {
        const {isLoading, uri} = this.props;

        if (isLoading) {
            return (
                <CardMedia
                    overlay={this.renderLoading()}
                    overlayContentStyle={{top: 0}}
                >
                    <img src={uri} />
                </CardMedia>
            );
        }

        return <CardMedia><img src={uri} /></CardMedia>;
    }

    renderLoading() {
        return <div className="loading-spinner">
            <CircularProgress
                style={{
                    position: 'absolute',
                    margin: '0 0 0 50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            />
        </div>;
    }

    render() {
        const {note, onNoteChange} = this.props,
            cardMedia = this.renderCardMedia();
        return (
            <Card className="pic">
                {cardMedia}
                <CardText>
                    <TextField
                        floatingLabelText="Note" multiLine={true}
                        value={note}
                        style={{maxWidth: 'calc(100% - 80px)'}}
                        onChange={onNoteChange}
                    />
                </CardText>
            </Card>
        );
    }
}

Pic.propTypes = {
    isLoading: PropTypes.bool,
    note: PropTypes.string.isRequired,
    uri: PropTypes.string,
    onNoteChange: PropTypes.func.isRequired
};
