const Stock = require('../models/stock-model');
const axios = require('axios');

const stockCodes = ["ETH","BTC","USDT","BNB","SOL"]; // Array of stock codes

const stockCltr={}

stockCltr.fetchAndSaveStockData = async (io) => {
    for (let i = 0; i < stockCodes.length; i += 5) {
        const batch = stockCodes.slice(i, i + 5);

        try {
            const stockDataPromises = batch.map(async (code) => {
                const response = await axios.post(`https://api.livecoinwatch.com/coins/single`, {
                    currency: "USD",
                    code: code,
                    meta: true
                }, {
                    headers: {
                        "content-type": "application/json",
                        "x-api-key": process.env.API_KEY,
                    }
                });

                const { name, symbol, rate } = response.data;
                const newStockData = new Stock({ name, symbol, code, rate, stockCode: code });

                await newStockData.save();
                io.emit('stockData', { stockCode: code, data: newStockData });
            });

            await Promise.all(stockDataPromises);

            // Limit to 20 records per stock code
            await Promise.all(batch.map(async (code) => {
                const excessCount = await Stock.countDocuments({ stockCode: code }) - 20;
                if (excessCount > 0) {
                    await Stock.deleteMany({ stockCode: code }).sort({ createdAt: 1 }).limit(excessCount);
                }
            }));

        } catch (error) {
            console.error(`Error fetching data for batch starting with index ${i}: `, error);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
};


stockCltr.getStoredStockData = async (req, res) => {
    try {
        // Fetch the latest 100 records
        const stockData = await Stock.find().sort({ createdAt: -1 }).limit(100);

        // Use an object to store the latest prices for each stock symbol
        const latestStocks = {};
        
        stockData.forEach(stock => {
            // Store only the latest entry for each stock code
            if (!latestStocks[stock.code]) {
                latestStocks[stock.code] = stock;
            }
        });

        // Convert the object back to an array and take the first 5 entries
        const result = Object.values(latestStocks).slice(0, 5);
        console.log('result',result)
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

stockCltr.getLatestStockValues = async (req, res) => {
    const { stock } = req.params;

    try {
        // Find the most recent stock entry for the given stock code
        const latestStockEntry = await Stock.findOne({ code: stock })
            .sort({ createdAt: -1 }); // Get the latest entry

        if (!latestStockEntry) {
            return res.status(404).json({ message: 'No records found for this stock.' });
        }

        // Now find the last 20 records related to this stock code
        const latestStocks = await Stock.find({ code: stock })
            .sort({ createdAt: -1 }) // Sort by the latest createdAt
            .limit(20); // Limit to 20 records

        res.status(200).json(latestStocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




module.exports = stockCltr