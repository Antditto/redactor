require('rootpath')();
const express = require('express');
const path = require('path');
const upload = require('controllers/upload');
const cors = require('cors');

const port = 3000;

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname,'public')));

app.use('*',express.static(path.join(__dirname+'/public/index.html')));

// app.get('/', (req,res) => {
// 	res.send("Invalid page");
// })

app.post('/upload', upload);

//app.use('/upload', upload);

app.listen(port, () => {
  console.log(`Started the server at port ${port}`);
});

// app.get('*', function(req, res, next) {
//   let err = new Error('Page Not Found');
//   err.statusCode = 404;
//   next(err);
// });
