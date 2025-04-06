const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/proxy-detect', upload.single('image'), async (req, res) => {
  try {
    confidence = 0.5
    iou = 0.3

    const form = new FormData();
    form.append('image', fs.createReadStream(req.params));
    form.append('confidence', confidence);
    form.append('iou', iou);

    const response = await axios.post('http://localhost:5001/detect-and-annotate', form, {
      headers: form.getHeaders(),
      responseType: 'stream',
    });

    res.set('Content-Type', 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error calling Python API:', error.message);
    res.status(500).send('Error processing image');
  } 
});

app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`);
});