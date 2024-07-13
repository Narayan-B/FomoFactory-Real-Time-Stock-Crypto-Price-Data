import axios from 'axios';

// Action types
export const FETCH_STOCKS_SUCCESS = 'FETCH_STOCKS_SUCCESS';
export const SET_SELECTED_STOCK = 'SET_SELECTED_STOCK';
export const FETCH_LATEST_STOCKS_SUCCESS = 'FETCH_LATEST_STOCKS_SUCCESS';

// Action creators
const fetchStocksSuccess = (stocks) => ({
  type: FETCH_STOCKS_SUCCESS,
  payload: stocks,
});

const fetchLatestStocksSuccess = (latestStocks) => ({
  type: FETCH_LATEST_STOCKS_SUCCESS,
  payload: latestStocks,
});

const setSelectedStockSuccess = (stockCode) => ({
  type: SET_SELECTED_STOCK,
  payload: stockCode,
});

// Thunk action creators
export const startFetchStocks = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:4563/get');
    dispatch(fetchStocksSuccess(response.data));
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }
};

export const startSetSelectedStock = (stockCode) => (dispatch) => {
  dispatch(setSelectedStockSuccess(stockCode));
};

export const startFetchLatestStockRecords = (stockCode) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:4563/latest/${stockCode}`);
    dispatch(fetchLatestStocksSuccess(response.data));
  } catch (error) {
    console.error('Error fetching latest stock records:', error);
  }
};
