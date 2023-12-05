import dotenv from 'dotenv'
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.js"
import multer from 'multer';
import util from 'util';
import { spawn, spawnSync } from 'child_process';
import { fstat, readdir, readdirSync, unlinkSync } from 'fs';
import { readFileSync } from 'fs';
import { error } from 'console';
import {PythonShell} from "python-shell";
import path from 'path';
const app = express();
//PORT & MIDDLEWARES
const port = process.env.PORT || 8000;
dotenv.config();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.json());

const pythonCaller = async () => {
  let data = null;
  await readdir("./public/images", (err, files) => {
    let file = files[0]
    console.log("IDHAR", file)
    let path = "/mnt/h/Capstone-webstack/capstone_backend/public/images/"+file
    console.log(path)
    // /mnt/h/Capstone-webstack/capstone_backend/public/images/OAS1_0003_MR1_mpr_n4_anon_111_t88_gfc_sag_95.jpg
    const child = spawn("wsl", ["-e", "python3","/mnt/h/capstone/CODE/predict.py", "/mnt/h/Capstone-webstack/capstone_backend/public/images/"+file])
    //const child = spawn("wsl", ["-e", "bash","/mnt/h/capstone/exec.sh"])
    //const child = spawn("python3",["/mnt/h/capstone/CODE/predict.py", "/mnt/h/Capstone-webstack/capstone_backend/public/images/OAS1_0003_MR1_mpr_n4_anon_111_t88_gfc_sag_95.jpg"])
    child.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    setTimeout(() => {
      data = readFileSync(`H:\\capstone\\output.txt`,'utf-8')
      console.log("THIS", data)
      cleanUp()
      return data
    }, 7000)




    })

  //console.log("HTIS", new_file)
  /*
console.log("spawned: " + child.pid);

    child.stdout.on('data', (data) => {
        console.log(data.toString())
    })

  child.stdout.on('data', function(data) {
    console.log("Child data: " + data);
  });
    child.on('error', function () {
      console.log("Failed to start child.");
    });
    child.on('close', function (code) {
      console.log('Child process exited with code ' + code);
    });
    child.stdout.on('end', function () {
      console.log('Finished collecting data chunks.');
    });
  */
}

const cleanUp = () => {
  console.log("FUNCTION CALLED")
  readdir("./public/images", (err, files) => {
      files.forEach(file => {
        const filePath = path.join("./public/images", file)
        unlinkSync(filePath)
      });
  })
}


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./public/Images")
  },
  filename:function (req, file, cb){
    return cb(null, `${file.originalname}`)
  }
})

const upload = multer({storage})
//My Routes
app.use("/api", authRoutes);

// app.post('/upload', upload.single('file'), async (req, res) => {
//     console.log(req.body);
//     console.log(req.file);
//     const stringData = await pythonCaller();
//     setTimeout(() => {
//       res.send(stringData)
//       console.log("AREADY SENT")
//     }, 10)
// })

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    let data = null;
    await readdir("./public/images", (err, files) => {
      let file = files[0]
      console.log("IDHAR", file)
      let path = "/mnt/h/Capstone-webstack/capstone_backend/public/images/"+file
      console.log(path)
      // /mnt/h/Capstone-webstack/capstone_backend/public/images/OAS1_0003_MR1_mpr_n4_anon_111_t88_gfc_sag_95.jpg
      const child = spawn("wsl", ["-e", "python3","/mnt/h/capstone/CODE/predict.py", "/mnt/h/Capstone-webstack/capstone_backend/public/images/"+file])
      //const child = spawn("wsl", ["-e", "bash","/mnt/h/capstone/exec.sh"])
      //const child = spawn("python3",["/mnt/h/capstone/CODE/predict.py", "/mnt/h/Capstone-webstack/capstone_backend/public/images/OAS1_0003_MR1_mpr_n4_anon_111_t88_gfc_sag_95.jpg"])
      child.stdout.on('data', (data) => {
        console.log(data.toString())
      })
      setTimeout(() => {
        data = readFileSync(`H:\\capstone\\output.txt`,'utf-8')
        console.log("THIS", data)
        cleanUp()
        res.status(200).send(data)
      }, 7000)
    })

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




