import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import multer from 'multer';
import cors from 'cors';

const app = express();
const port = 3005;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testtestttt96@gmail.com',
    pass: 'llvhjudfvfznqghu',
  },
});

app.post('/myapp/send', upload.single('file'), (req, res) => {
  const { name, email, message } = req.body;
  const file = req.file;

  const mailOptions = {
    from: 'testtestttt96@gmail.com',
    to: 'stekhnovychandriy@gmail.com',
    subject: 'Test project',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    attachments: file
      ? [
          {
            filename: file.originalname,
            content: file.buffer,
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});