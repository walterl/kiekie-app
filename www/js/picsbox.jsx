import React from 'react';

import Pic from './pic';

import '../scss/picsbox.scss';


export default class PicsBox extends React.Component {
    render() {
        var i = 0,
            nextPicId = () => `pic-${i++}`,
            pics = this.props.pics.map(
                (picData) => <Pic key={nextPicId()} src={picData} />
            );

        return (
            <div id="picsbox">{pics}</div>
        );
    }
}
