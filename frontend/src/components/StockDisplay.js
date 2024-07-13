import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import bg from '../assets/images/stock-bg.jpg'
import { startFetchStocks, startSetSelectedStock, startFetchLatestStockRecords } from '../actions/stock-actions';
import io from 'socket.io-client';
import {
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap';
import StockTable from './StockTable';

const socket = io('http://localhost:4563');

const StockData = () => {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stocks.data);
  const selectedStock = useSelector((state) => state.stocks.selectedStock);
  const latestRecords = useSelector((state) => state.stocks.latestRecords);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStockCode, setSelectedStockCode] = useState('');

  useEffect(() => {
    dispatch(startFetchStocks());

    socket.on('stockData', (newStockData) => {
      const isStockInTop5 = stocks.slice(0, 5).some(stock => stock.code === newStockData.code);
      if (isStockInTop5) {
        dispatch({ type: 'UPDATE_STOCK_SUCCESS', payload: newStockData });
      }
    });

    socket.on('latestStockData', (newData) => {
      dispatch({ type: 'FETCH_LATEST_STOCKS_SUCCESS', payload: [newData, ...latestRecords].slice(0, 20) });
    });

    return () => {
      socket.off('stockData');
      socket.off('latestStockData');
    };
  }, [dispatch, stocks, latestRecords]);

  useEffect(() => {
    if (selectedStock) {
      dispatch(startFetchLatestStockRecords(selectedStock));
    }
  }, [selectedStock, dispatch]);

  useEffect(() => {
    if (selectedStock) {
      const intervalId = setInterval(() => {
        dispatch(startFetchLatestStockRecords(selectedStock));
      }, 5000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [selectedStock, dispatch]);

  const handleStockChange = (event) => {
    setSelectedStockCode(event.target.value);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSubmit = () => {
    dispatch(startSetSelectedStock(selectedStockCode));
    handleModalClose();
  };

  const containerStyle = {
    backgroundImage: `url(${bg})`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    minHeight: '100vh',
    color: 'white',
  };

  const tableStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '8px',
  };

  const stockCodes = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL'];

  return (
    <div style={containerStyle}>
      <div className="d-flex justify-content-center">
        <Button color="primary" onClick={handleModalOpen}>Single Stock Details</Button>
      </div>
      <h2>Latest Records for {selectedStock}</h2>
      {selectedStock && (
        <StockTable stocks={latestRecords} stockName={selectedStock} />
      )}
      <h1>Stock Data</h1>
      <Card style={tableStyle}>
        <CardBody>
          <CardTitle tag="h5">Top Stocks</CardTitle>
          <Table hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {stocks.slice(0, 5).map((stock, index) => (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.code}</td>
                  <td>{stock.rate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={handleModalClose}>
        <ModalHeader toggle={handleModalClose}>Select Stock</ModalHeader>
        <ModalBody>
          <Input type="select" value={selectedStockCode} onChange={handleStockChange}>
            <option value="">Select a stock</option>
            {stockCodes.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>Submit</Button>
          <Button color="secondary" onClick={handleModalClose}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default StockData;
