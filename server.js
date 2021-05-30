const express = require('express');
const path = require('path');
const request = require('request');

const app = express();

// Init Middleware
app.use(express.json({extended: false}));
app.use(express.static(__dirname + '/public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header(
    'Access-Control-Allow-Headers',
    (value = 'Origin, Content-Type, x-auth-token')
  );
  next();
});
//;;
// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/station', require('./routes/api/station'));
app.use('/api/measurement', require('./routes/api/measurement'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
