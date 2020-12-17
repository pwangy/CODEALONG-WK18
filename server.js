import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import membersData from './data/technigo-staff.json'
import rolesData from './data/technigo-roles.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

const Member = new mongoose.model('Member', {
  name: String,
  surname: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  lettersInName: Number,
  isPapa: Boolean
});

const Role = new mongoose.model('Role', {
  description: String
})

if (process.env.RESET_DATABASE) {

  // POPULATING DATABASE WITH ONE COLLECTION

  // const populateDatabase = async () => {
  //   await Member.deleteMany();
  
  //   membersData.forEach(async item => {
  //     const newMember = new Member(item);
  //     await newMember.save();
  //   })
  // }
  // populateDatabase();

  // POPULATING DATABASE WITH TWO COLLECTIONS (WITH RELATIONS) - HARDCODED

  // const codeCoach = new Role({
  //   description: "Code coach"
  // });
  // codeCoach.save();

  // const careerCoach = new Role({
  //   description: "Career coach"
  // });
  // careerCoach.save();

  // const projectManager = new Role({
  //   description: "Project manager"
  // })
  // projectManager.save();


  // const van = new Member({
  //   name: "Van",
  //   surname: "Taylor",
  //   role: codeCoach,
  //   lettersInName: 3,
  //   isPapa: false
  // })
  // van.save();

  // const poya = new Member({
  //   name: "Poya",
  //   surname: "Tavakolian",
  //   role: projectManager,
  //   lettersInName: 4,
  //   isPapa: true
  // })
  // poya.save();

  // const matilda = new Member({
  //   name: "Matilda",
  //   surname: "Arvidsson",
  //   role: codeCoach,
  //   lettersInName: 7,
  //   isPapa: false
  // })
  // matilda.save();

  // const maksymilian = new Member({
  //   name: "Maksymilian",
  //   surname: "Olszewski",
  //   role: codeCoach,
  //   lettersInName: 11,
  //   isPapa: false
  // })
  // maksymilian.save();

  // const petra = new Member({
  //   name: "Petra",
  //   surname: "Stenqvist",
  //   role: careerCoach,
  //   lettersInName: 5,
  //   isPapa: false
  // })
  // petra.save();

  // POPULATING DATABASE WITH TWO COLLECTIONS (WITH RELATIONS) - UNIVERSAL

  const populateDatabase = async () => {

    // First of all, we need to clear current content of two collections
    await Role.deleteMany();
    await Member.deleteMany();

    // Next, we declare empty array in which we will later on
    // store 3 instances (actual examples) of Role models
    let roles = [];

    rolesData.forEach( async item => {
      const newRole = new Role(item);
      
      // We push each newRole to array roles
      roles.push(newRole);
      await newRole.save();
    })
  
    membersData.forEach(async memberItem => {

      // We create new member for element in membersData array from JSON file
      // Important thing to notice: in JSON file we had property "role" with
      // hardcoded string value. We need it to detect which role model should
      // each member have. Later on, hardcoded "role" property will be
      // overwritten by new "role" property, the one with value of ObjectId type.
      // For further reference on that, check out last example from website below,
      // the one about keys collision : https://davidwalsh.name/merge-objects
      const newMember = new Member({
        ...memberItem,
        role: roles.find(roleItem => roleItem.description === memberItem.role)
      });
      await newMember.save();
    })
  }
  populateDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/members', async (req, res) => {
  const allMembers = await Member.find(req.query).skip(2).limit(2);
  res.json(allMembers);
})

app.get('/members/:name', (req, res) => {
  Member.findOne({ name: req.params.name })
    .then(data => {
      res.json(data);
    })
    .catch(error => {
      res.status(400).json({ error: "Invalid name" });
    })
})

app.get('/members/role/:role', (req, res) => {
  Member.find(req.params, (err, data) => {
    res.json(data);
  })
})

app.get('/members/:id/role', async (req, res) => {

  // Find for single member with ID from req.params
  const singleMember = await Member.findById(req.params.id);

  // Find role details for single member queried above
  const singleMemberRole = await Role.findById(singleMember.role);

  if (singleMemberRole) {
    res.json(singleMemberRole);
  } else {
    res.json(404).json({ error: "Not found" });
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
