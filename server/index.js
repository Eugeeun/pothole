const express = require('express');
const PORT = process.env.PORT || 5000;
const { connect } = require('./connect');
const fs = require('fs');

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

app.post('/api/upload', (req, res) => {
  // FormData에서 이미지 파일을 받아서 서버에 저장합니다.
  console.log(req.body);
  // const imageFile = req.files.images;
  // const filePath = `./uploads/${imageFile.name}`;

  // imageFile.mv(filePath, (error) => {
  //   if (error) {
  //     console.error('프레임 저장 실패:', error);
  //     return res.status(500).send('프레임 저장에 실패했습니다.');
  //   }

  //   console.log('프레임 저장 완료:', filePath);

  //   // 추가적인 작업을 수행할 수 있습니다.

  //   res.send('프레임이 성공적으로 전송되었습니다.');
  // });
});

app.listen(PORT, () => {
  console.log(`Server is Listening on ${PORT}!!`);
});
