import React from 'react';
import { Table, Card, CardBody, CardTitle } from 'reactstrap';

const StockTable = ({ stocks, stockName }) => {
  return (
    <Card style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '8px', marginTop: '20px' }}>
      <CardBody>
        <CardTitle tag="h5">Latest 20 records for {stockName}</CardTitle>
        <Table hover>
          <thead>
            <tr>
              <th className='text-center'>Rate</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length > 0 ? (
              stocks.map((record, index) => (
                <tr key={index}>
                  <td className='text-center'>{record.rate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No records available</td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default StockTable;
