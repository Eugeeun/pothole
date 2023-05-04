const express = require('express');
const PORT = process.env.PORT || 5000;
const { connect } = require('./connect');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/save_imgs', express.static('save_imgs'));

// 포트홀의 정보를 받아옴
app.get('/api/potholes', (req, res) => {
  const query = `select * from pothole_infomation;`;
  connect.query(query, (err, rows, fields) => {
    if (err) res.status(400).json({ success: false });
    res.status(200).json(rows.map((item) => item));
  });
});

app.listen(PORT, () => {
  console.log(`Server is Listening on ${PORT}!!`);
});
