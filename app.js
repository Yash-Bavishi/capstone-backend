import dotenv from 'dotenv'
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.js"
import multer from 'multer';


const app = express();
//PORT & MIDDLEWARES
const port = process.env.PORT || 8000;
dotenv.config();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./public/Images")
  },
  filename:function (req, file, cb){
    return cb(null, `${Date.now}()_${file.originalname}`)
  }
})

const upload = multer({storage})
//My Routes
app.use("/api", authRoutes);

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.body);
    console.log(req.file);
})

//DB Connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  app.listen(port, () => console.log(`app is running at ${port}`));
}).catch((error) => console.log(`${error} did not connect`));




