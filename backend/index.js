import express from'express';
import bodyParser from 'body-parser';

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc, getDocs, addDoc, collection, runTransaction, arrayUnion, arrayRemove, query, where, Timestamp, updateDoc, deleteDoc  } from 'firebase/firestore';
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
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
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

  const campaignCharacters = campaignData.characters || [];
  const charactersData = []
  for(let i = 0; i < campaignCharacters.length; i++) {
    const characterDoc = doc(db, 'characters', campaignCharacters[i].id);
    const characterDocSnap =  await getDoc(characterDoc);
    const characterData = characterDocSnap.data();
    characterData.author = characterData.author.id;
    characterData.id = campaignCharacters[i].id;
    charactersData.push(characterData)
  }

  const arrayUserIds = campaignUsers.map(userDoc => userDoc.id)
  campaignData['users'] = arrayUserIds
  campaignData['dm'] = campaignData.dm.id
  campaignData['startDate'] = campaignData['startDate'].toDate();
  campaignData['id'] = campaignDoc.id
  campaignData['characters'] = charactersData;

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

app.delete('/campaign/:id',  authenticateToken, async(req,res) => { 
  const { username } = req.user;
  const { id } = req.params;

  
  //Actually delete in transaction (also delete campaign ID from the users its connected to.)
  try {
    await runTransaction(db, async(transaction) => {
      const campaignDoc = doc(db, 'campaigns', id);
      const campaignDocSnap = await transaction.get(campaignDoc);
      
      if(!campaignDocSnap.exists()){
        return res.status(500).send({message: `Campaign with id: ${id} was not found in the database`});
      }
    
      const campaignData = campaignDocSnap.data();
      const dmDOcOfCampaign = campaignData.dm;
      const dmId = dmDOcOfCampaign.id;
    
      if(dmId !== username) {
        return res.status(403).send({message: 'Only the DM of the campaign may delete the campaign.'})
      }
      if(!Array.isArray(campaignData.users)) {
        return res.status(500).send({message: `${id} does not contain correct data.`})
      }

      // Delete the campaign reference from the connected users.
      for(let i=0; i < campaignData.users.length; i ++) {
        const userDoc = campaignData.users[i]
        await transaction.update(userDoc, {
          campaigns: arrayRemove(campaignDoc)
        })
      }

      //Remove the campaign document from the database.
      await transaction.delete(campaignDoc)
      return res.status(200).send({message: `Campaign with id: ${id} has been deleted from the database.`})

    })
  } catch (error) {
    console.error('Delete campaign transaction failed with error:', error)
    res.status(500).send({
      message: error
    })
  }
})

app.post('/characters', authenticateToken, async(req,res) => {
  const { username } = req.user;
  const {campaignId, name, race, class: characterClass, alignment, bio} = req.body

  try {
    await runTransaction(db, async(transaction) => {
      const campaignDoc = await doc(db, 'campaigns', campaignId);
      const characterDoc = await doc(collection(db, 'characters'));
      const userDoc = await doc(db, 'users', username)
      
      const campaignDocSnap = await transaction.get(campaignDoc);
      const userDocSnap = await transaction.get(userDoc);
      
      if(!campaignDocSnap.exists()){
        console.error(`Campaign with id: ${campaignId} not found!`);
        return res.status(500).send({message: "Campaign not found in the database."});
      }

      if(!userDocSnap.exists()) {
        console.error(`User with id: ${username} not found!`);
        return res.status(500).send({message: "Author user not found in the database"})
      }

      const campaignData = campaignDocSnap.data();
      const campaignUsers = campaignData.users;

      const userIsPartOfCampaign = campaignUsers.some(user => user.id === username)
      if(!userIsPartOfCampaign) {
        console.error(`User: ${username}, is not part of campaign: ${campaignId}, and may not add characters.`)
        return res.status(403).send({message: 'You are not part of this campaign and are not allowed to add characters to it.'})
      }

      await transaction.set(characterDoc, {
        name,
        race,
        class: characterClass,
        alignment,
        bio,
        author: userDoc
      })

      await transaction.update(campaignDoc, {
        characters: arrayUnion(characterDoc)
      })

      const responseObject = {
        name,
        race,
        class: characterClass,
        alignment,
        bio,
        id: characterDoc.id,
        author: userDoc.id
      }
      
      return res.status(200).send(responseObject)



    })
  } catch (error) { 
    console.error(error);
    return res.status(500).send({message: "Something went wrong trying to add the character to the campaign."})
  }
})

app.put('/characters/:id', authenticateToken, async(req,res) => {
  const { username } = req.user;
  const { id } = req.params;

  const { name, race, class: characterClass, alignment, bio, campaignId } = req.body;

  const characterDoc = doc(db, 'characters', id);
  const characterDocSnap = await getDoc(characterDoc);

  if(!characterDocSnap.exists()) {
    return res.status(500).send({message: `The character with id: ${id} does not exist in the database and cannot be updated`});
  }

  const characterData = characterDocSnap.data();
  const { author } = characterData;

  // We only allow the author of the character and the DM to edit the character.
  let mayEditCharacterDoc = false;
  
  if(username === author.id){
    mayEditCharacterDoc = true;
  } else {
    //If the requester is not the author, we check if it is the DM of the campaign this character is part of.
    const campaignDoc = doc(db, 'campaigns', campaignId);
    const campaignDocSnap = await getDoc(campaignDoc);
    
    if(!campaignDocSnap.exists()){
      // The requester is not the character author and we can't check if it is the DM of the campaign, so we don't allow the edit.
      return res.status(500).send({message: `The campaign with the id: ${campaignId} does not exist in the database, as such the request cannot be authorized.`})
    }

    const campaignData = campaignDocSnap.data();
    const { dm } = campaignData;
    if(username === dm.id) {
      mayEditCharacterDoc = true;
    }
  }
  
  //We check if the var was set to true, if not we return immediately.
  if(!mayEditCharacterDoc) {
    return res.status(403).send({message: `This user is not allowed to edit the character with id: ${id}`})
  }

  await updateDoc(characterDoc, {
    name,
    race,
    class: characterClass,
    alignment,
    bio
  }).catch(() => {
    return res.status(500).send({message: `Something went wrong while updating character with id: ${id}`});
  })

  const responseObject = {
    name,
    race,
    class: characterClass,
    alignment,
    bio,
    id,
    author: author.id
  }

  return res.status(200).send(responseObject)

})


app.delete('/characters/:id', authenticateToken, async(req,res) => {
  const { username } = req.user;
  const { id } = req.params;
  const { campaignId } = req.body;

  try {
    await runTransaction(db, async(transaction) => {
      const campaignDoc = doc(db, 'campaigns', campaignId)
      const campaignDocSnap = await transaction.get(campaignDoc);
      
      if(!campaignDocSnap.exists()){
        return res.status(500).send({message: "The campaign that a character is being deleted from does not exist in the database."})
      }

      const characterDoc = doc(db, 'characters', id)
      const characterDocSnap = await transaction.get(characterDoc)

      if(!characterDocSnap.exists()) {
        return res.status(404).send({message: `The character with id: ${id} does not exist in the database.`})
      }

      const characterData = characterDocSnap.data();
      const { author } = characterData;
      //Author is a doc, whose id is equal to the username.
      if(author.id !== username) {
        return res.status(403).send({message: "Only the author of a character may delete the character."})
      }

      await transaction.update(campaignDoc, {
        characters: arrayRemove(characterDoc)
      })
      await transaction.delete(characterDoc)
      return res.status(200).send({
        message: "Character successfully deleted from campaign.",
        id: id
      })

    })
  } catch(error) {
    console.error(`Error trying to delete character with id: ${id}`, error)
    res.status(500).send({
      message: "Something went wrong while deleting this character. Please try again later."
    })
  }

})

app.listen(port, '0.0.0.0', () => {
  console.log(`App listening at http://0.0.0.0:${port}`);
});