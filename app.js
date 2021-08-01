const express = require('express');
const path = require('path');
const config = require('config');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth.routes.js');
const linkRouter = require('./routes/link.routes.js');

const app = express();

app.use(express.json({ extended: true }));
app.use('/api/auth', authRouter);
app.use('/api/link', linkRouter);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}

const PORT = config.get('port') || 3001;

async function start() {
  try {
    await mongoose.connect(config.get('mongoUrl'), { 
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
     });
    app.listen(PORT, () => console.log('Server has been started on ' + PORT));
  } catch(err) {
    console.log(`server error: ${err}`);
    process.exit(1);
  }
}

start();

