const initialState = {
    data: [],
    selectedStock: '',
    latestRecords: [],
  };
  
  const stockReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_STOCKS_SUCCESS':
        return { ...state, data: action.payload };
      case 'SET_SELECTED_STOCK':
        return { ...state, selectedStock: action.payload };
      case 'FETCH_LATEST_STOCKS_SUCCESS':
        return { ...state, latestRecords: action.payload };
      case 'UPDATE_STOCK_SUCCESS':
        return {
          ...state,
          data: state.data.map(stock =>
            stock.code === action.payload.code ? action.payload : stock
          ),
        };
      default:
        return state;
    }
  };
  
  export default stockReducer;
  