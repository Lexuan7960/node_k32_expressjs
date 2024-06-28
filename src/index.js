const express = require('express');
const rootRoute = require('./routes');

const app = express();
const PORT = 3000

app.use(express.json())
app.use('/api/v1', rootRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});