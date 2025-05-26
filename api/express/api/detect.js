const fs = require("fs")
const axios = require("axios")
const FormData = require("form-data")
const multer = require("multer")

const upload = multer({ dest: "uploads/" })

module.exports.setApp = function (app, client) {
  app.post("/api/proxy-detect", upload.single("image"), async (req, res) => {
    try {
      const confidence = 0.5
      const iou = 0.3

      // Check file exists
      if (!req.file) return res.status(400).send("No image uploaded")

      // Create FormData to send to Flask
      const form = new FormData()
      form.append("image", fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      })
      form.append("confidence", confidence.toString())
      form.append("iou", iou.toString())

      // POST to Flask
      const response = await axios.post(
        "http://localhost:5001/detect-and-annotate",
        form,
        {
          headers: form.getHeaders(),
          responseType: "stream",
        }
      )

      // Pipe the image response back
      res.set("Content-Type", "image/jpeg")
      response.data.pipe(res)
    } catch (error) {
      console.error(
        "Error calling Python API:",
        error.response?.data || error.message
      )
      res.status(500).send("Error processing image")
    } finally {
      fs.unlink(req.file.path, () => {}) // cleanup temp file
    }
  })
}
