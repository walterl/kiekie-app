/* global __DEVELOPMENT__ */
import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import rootReducer from './reducers';


export default function configureStore(initialState) {
    var middlewares = [thunkMiddleware];

    if (__DEVELOPMENT__) {
        middlewares.push(createLogger());
    }

    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middlewares)
    );
}
