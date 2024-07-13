import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import stockReducer from '../reducers/stock-reducer';

const configureStore = () => {
  const store = createStore(
    combineReducers({
      stocks: stockReducer,
    }),
    applyMiddleware(thunk)
  );
  return store;
};

export default configureStore;
