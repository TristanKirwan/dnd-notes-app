import express from'express';
import bodyParser from 'body-parser';

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, getDocs, addDoc, collection, runTransaction, arrayUnion, query, where, Timestamp, updateDoc  } from 'firebase/firestore';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(process.env.firebaseConfig)
const firebaseApp = initializeApp(firebaseConfig);
global.db = getFirestore(firebaseApp);

global.app = express();
const port = 8000;

function authenticateToken(req,res,next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) return res.sendStatus(401)
  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
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
    setDoc(accountDocRef, {password: hash, campaigns: [] })
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

//THIS IS NOT FINISHED!
app.post('/addNote', authenticateToken, async(req,res) => {
  const { text } = req.body
  const user = req.user
  console.log(user)
  const docRef = await addDoc(collection(db, 'notes'), {
    text: text
  })
})

app.get('/getCampaigns', authenticateToken, async(req, res) => {
  const { username } = req.user
  const userDoc = doc(db, 'users', `${username}`);
  const userDocSnap = await getDoc(userDoc)
  if(!userDocSnap.exists()) {
    res.status(500).send({message: `User ${username} does not exist in the database!`})
  }
  const campaignQuery = query(collection(db, "campaigns"), where("users", "array-contains", userDoc))

  const querySnapshot = await getDocs(campaignQuery);

  const connectedCampaigns = []
  querySnapshot.forEach(doc => {
    const campaignData = doc.data();
    const campaignUsers = campaignData.users.map(user => user.id)
    connectedCampaigns.push(
      {
        title: campaignData.title,
        description: campaignData.description,
        type: campaignData.type,
        dm: campaignData.dm.id,
        users: campaignUsers,
        id: doc.id
      }
    )
  })
  
  res.status(200).send({
    campaigns: connectedCampaigns
  })
})

app.post('/addCampaign', authenticateToken, async(req,res) => {
  const { title, dm, description, type, users } = req.body
  try {
    await runTransaction(db, async (transaction) => {
      const usersArray = []
      const campaignDocRef = doc(collection(db, 'campaigns'))

      for(let i = 0; i < users.length; i ++ ){
        const currentUser = users[i]
        const userRef = doc(db, 'users', `${currentUser}`);
        const userDoc = await transaction.get(userRef)

        //All users filled in should exist.
        if(!userDoc.exists()) {
          throw `User ${currentUser} does not exist in database!`
        }

        usersArray.push(userRef)
      }
      

      // Because the users are added in the same order, we can use the index to find the document of the DM, instead of querying again.
      const dmIndex = users.indexOf(dm)
      const dmDoc = usersArray[dmIndex]

      for(let i = 0; i < usersArray.length; i ++ ) {
        const currentUserDoc = usersArray[i]
        await transaction.update(currentUserDoc, {
          campaigns: arrayUnion(campaignDocRef)
        })
      }

      const currentDate = Timestamp.now();
      await transaction.set(campaignDocRef, {
        title: title,
        description: description,
        type: type,
        dm: dmDoc,
        users: usersArray,
        startDate: currentDate
      })

      res.status(200).send({
        title: title,
        description: description,
        type: type,
        dm: dm,
        users: users,
        id:campaignDocRef.id
      })
    })
  } catch (error) {
    console.error('Transaction failed with error:', error)
    res.status(500).send({message: error})
  }
})

app.get('/users/:id', async(req, res) => {
  const { id } = req.params
  const userDoc = doc(db, 'users', `${id}`);
  const userDocSnap = await getDoc(userDoc)
  if(!userDocSnap.exists()) {
    return res.status(500).send({message: `User ${id} does not exist in the database!`})
  } else {
    return res.status(200).send({success: true})
  }
})

app.get('/campaign/:id', authenticateToken, async(req, res) => {
  const { username } = req.user
  const { id } = req.params
 
  const campaignDoc = doc(db, 'campaigns', `${id}`);
  const campaignDocSnap = await getDoc(campaignDoc);
  if(!campaignDocSnap.exists()){
    return res.status(404).send({message: 'The campaign with the given ID does not exist'})
  }

  const campaignData = await campaignDocSnap.data();
  const campaignUsers = campaignData.users
  if(!Array.isArray(campaignUsers)) {
    return res.status(500).send({message: 'The requested document was faulty'});
  }

  const arrayUserIds = campaignUsers.map(userDoc => userDoc.id)
  campaignData['users'] = arrayUserIds
  campaignData['dm'] = campaignData.dm.id
  campaignData['startDate'] = campaignData['startDate'].toDate();
  campaignData['id'] = campaignDoc.id

  if(Array.isArray(campaignData.users) && arrayUserIds.indexOf(username) >= 0) {
    res.status(200).send(campaignData)
  } else {
    return res.status(403).send({message: 'User is not allowed to view this document.'})
  }
})

app.put('/campaign/:id', authenticateToken, async(req,res) => {
  const { username } = req.user;
  const { id } = req.params;
  
  const { title, type, dm, description, users } = req.body

  const campaignDoc = doc(db, 'campaigns', `${id}`);
  const campaignDocSnap = await getDoc(campaignDoc);
  if(!campaignDocSnap.exists()) {
    console.error('The campaign that was trying to be edited does not exist.')
    return res.status(404).send({message: 'The campaign with the given ID does not exist'})
  }

  const campaignData = await campaignDocSnap.data();

  const dmOfCampaign = campaignData.dm;
  const dmUserDocSnap = await getDoc(dmOfCampaign)
  if(!dmUserDocSnap.exists()) {
    console.error('The DM of this campaign does not exist');
    return res.status(500).send({message: "The DM of this campaign does not exist."})
  }

  if(dmUserDocSnap.id !== username) {
    console.error(`The user ${username} is not authorized to edit campaign with ID:${campaignDocSnap.id}`)
    return res.status(403).send({message: `The user ${username} is not authorized to edit campaign with ID:${campaignDocSnap.id}`})
  }

  let dmDoc = null;
  const usersDocRefs = [] 

  for(let i = 0; i < users.length; i++) {
    const currentUser = users[i];
    const userDocRef = doc(db, 'users', currentUser);
    const userDoc = await getDoc(userDocRef);
    if(!userDoc.exists()) {
      return res.status(500).send({message: `User: ${currentUser} does not exist in the database.`})
    }
    if(currentUser === dm) {
      dmDoc = userDocRef
    }
    usersDocRefs.push(userDocRef)
  }


  await updateDoc(campaignDoc, {
    description: description,
    dm: dmDoc,
    title: title,
    type: type,
    users: usersDocRefs
  })


  const responseObject = {
    title: title,
    description: description,
    dm: dm,
    type: type,
    users: users
  }

  res.status(200).send(responseObject)
})

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://0.0.0.0:${port}`);
});