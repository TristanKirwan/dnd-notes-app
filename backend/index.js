import express from'express';
import bodyParser from 'body-parser';

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc  } from 'firebase/firestore';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(process.env.firebaseConfig)
const firebaseApp = initializeApp(firebaseConfig);
global.db = getFirestore(firebaseApp);

global.app = express();
const port = 8000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', async (req, res) => {
  //Maybe move this somewhere else?

  const { username, password } = req.body
  const accountDocRef = doc(db, 'users', `${username}`);
  const accountDocSnap = await getDoc(accountDocRef)

  if (!accountDocSnap.exists()) {
    console.log('No account with entered name, continue registration');
    const hash = await bcrypt.hash(password, 10);
    setDoc(accountDocRef, {password: hash })
    res.status(200).send('User added successfully');
  } else {
    console.log(`Username: ${username} already exists in the database`);
    res.status(500);
    res.send({userNameExists: true});
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const accountDocRef = doc(db, 'users', `${username}`);
  const accountDocSnap = await getDoc(accountDocRef)

  if (!accountDocSnap.exists()) {
    res.status(500).send({notFound: true});
  } else {
    const docData = accountDocSnap.data();
    const existingPass = docData.password;
    if(await bcrypt.compare(password, existingPass)){
      const accessToken = jsonwebtoken.sign({username: username}, process.env.ACCESS_TOKEN_SECRET);
      res.status(200).send({accessToken: accessToken})
    } else {
      res.status(500).send({passwordIncorrect: true})
    }
  }

})

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://0.0.0.0:${port}`);
});