import React from 'react';
import {hashHistory} from 'react-router';

import AppBar from 'material-ui/AppBar';
import ContentSave from 'material-ui/svg-icons/content/save';
import EditorShortText from 'material-ui/svg-icons/editor/short-text';
import IconButton from 'material-ui/IconButton';
import ImageAddAPhoto from 'material-ui/svg-icons/image/add-a-photo';
import {List, ListItem} from 'material-ui/List';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import '../../scss/help.scss';


export default class Help extends React.Component {
    render() {
        const
            menuCloseBtn =
                <IconButton onTouchTap={() => hashHistory.goBack()}>
                    <NavigationArrowBack />
                </IconButton>;

        return <div>
            <AppBar
                title="Kiekie Help"
                iconElementLeft={menuCloseBtn}
            />
            <List>
                <ListItem
                    primaryText="Taking pictures"
                    leftIcon={<ImageAddAPhoto />}
                    initiallyOpen={false}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                        <div className="section">Just take the picture!</div>
                    ]}
                />
                <ListItem
                    primaryText="Saving pictures"
                    leftIcon={<ContentSave />}
                    initiallyOpen={false}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                        <div className="section">Just click the save icon.</div>
                    ]}
                />
                <ListItem
                    primaryText="Adding notes to pictures"
                    leftIcon={<EditorShortText />}
                    initiallyOpen={false}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                        <div className="section">
                            Add it after clicking on image.
                        </div>
                    ]}
                />
            </List>
        </div>;
    }
}
