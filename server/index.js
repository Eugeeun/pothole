const express = require('express');
const PORT = process.env.PORT || 5000;
const { connect } = require('./connect');
const { exec } = require('child_process');
const multer = require('multer');

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

// 파일 저장을 위한 multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 파일 저장 경로 설정
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // 파일 이름 설정
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// 파일 업로드를 처리하는 라우트 핸들러
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 전송되지 않았습니다.' });
  }

  // 파일이 정상적으로 저장되었을 경우
  res.status(200).json({ message: '파일이 정상적으로 저장되었습니다.' });
});

app.listen(PORT, () => {
  console.log(`Server is Listening on ${PORT}!!`);
  // 'python yolov5/detect.py --weights best1.pt --conf 0.6 --source uploads/frame.jpg'; 나중엔 이거로 사용할 것
  const pythonScript =
    'python yolov5/detect.py --conf 0.4 --source uploads/frame.jpg';

  exec(pythonScript, (error, stdout, stderr) => {
    if (error) {
      console.error(`Python script execution error: ${error}`);
      return;
    }
    console.log(stdout);
  });
});
