const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));

// Home route to display search form
app.get('/', (req, res) => {
    res.render('index', { stockData: null, error: null, loading: false });
});

// Route to handle stock search
app.post('/search', async (req, res) => {
    const stockSymbol = req.body.stockSymbol.toUpperCase();
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${apiKey}`;

    try {
        // Fetch the stock data
        const response = await axios.get(url);
        const stockInfo = response.data["Global Quote"];
        
        if (stockInfo && stockInfo["01. symbol"]) {
            const stockData = {
                symbol: stockInfo["01. symbol"],
                price: stockInfo["05. price"],
                change: stockInfo["10. change percent"]
            };
            // Render the view with the stock data
            res.render('index', { stockData, error: null, loading: false });
        } else {
            // Render the view with an error message if no data found
            res.render('index', { stockData: null, error: 'Invalid stock symbol or data not found.', loading: false });
        }
    } catch (error) {
        // Handle errors such as network issues or invalid API responses
        res.render('index', { stockData: null, error: 'Network issue or invalid API response.', loading: false });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
