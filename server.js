const express = require('express'); //เรียกใช้ express ผ่าน require
const path = require('path');
const app = express(); //สร้างตัวแปร app เพื่อใช้งาน express 
const port = 3000; //พอร์ตของ Server ที่ใช้ในการเปิด Localhost 
  
// ตั้งค่าให้เสิร์ฟไฟล์สถิติจากโฟลเดอร์ public
app.use(express.static(path.join(__dirname, 'public')));

// เส้นทาง root เสิร์ฟไฟล์ index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/view', 'pdf.html'));
});

app.listen(port, () => {
  console.log(`Server running at <http://localhost>:${port}/`);
});