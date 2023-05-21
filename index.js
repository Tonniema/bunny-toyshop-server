const express = require('express')
const app = express()

var cors = require('cors')
// var jwt = require('jsonwebtoken')
app.use(cors())
require('dotenv').config();

app.use(express.json())
const port = process.env.PORT || 9000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jufhth7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("Disney_Doll");
    const Disney_Doll_All_Data = database.collection("Disney_Doll_All_Data"); //database collection 1
    app.post('/dolls', async (req, res) => {  
      const doll = req.body;
      console.log(doll);
      //https://www.mongodb.com/docs/drivers/node/current/usage-examples/insertOne/                               
      const result = await Disney_Doll_All_Data.insertOne(doll);
      res.send(result)
    })
    app.get('/dolls', async (req, res) => {   
      // https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
      const cursor = Disney_Doll_All_Data.find();
      const result = await cursor.toArray()                                                               
      res.send(result)
    })
    app.get('/dolls/:id', async (req, res) => {  
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await Disney_Doll_All_Data.findOne(query);
      res.send(result)
  
    })
    app.get('/mydolls',async(req,res)=>{
      let query = {}
      if(req.query?.email){
        query = {update_seller_email: req.query?.email }                                                 
      }
      const options = {
        sort: {price:1}
      }
      const result = await Disney_Doll_All_Data.find(query,options).toArray()
      res.send(result);
    })
    app.delete('/dolls/:id', async (req, res) => {  
      const id = req.params.id
      const query = { _id: new ObjectId(id) };                                                             
      const  Doll = await Disney_Doll_All_Data.deleteOne(query);       
      res.send( Doll)
    })
    app.get('/frozen', async (req, res) => {   
      const query = {select: "Frozen" }
      const cursor = Disney_Doll_All_Data.find(query);
      const result = await cursor.toArray()                                                               
      res.send(result)
    })
    app.get('/mickey', async (req, res) => {   
      const query = {select: "Mickey" }
      const cursor = Disney_Doll_All_Data.find(query);
      const result = await cursor.toArray()                                                                
      res.send(result)
    })
    app.get('/pooh', async (req, res) => {   
      const query = {select: "Pooh" }
      const cursor = Disney_Doll_All_Data.find(query);
      const result = await cursor.toArray()                                                                
      res.send(result)
    })
    app.get('/princess', async (req, res) => {   
      const query = {select: "Princess" }
      const cursor = Disney_Doll_All_Data.find(query);
      const result = await cursor.toArray()                                                                
      res.send(result)
    })
    app.get('/searchText/:text',async(req,res)=>{
      const body = req.params.text;
      const result = await Disney_Doll_All_Data.find({
        $or: [
          {name: {$regex: body, $options: "i"}}                                                          //Search System
        ]
      }).toArray()
      res.send(result)
    })
    app.put('/dolls/:id', async (req, res) => {
      const id = req.params.id
      const Update_doll = req.body;
      //https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
      const filter = { _id: new ObjectId(id) };                                            
      const options = { upsert: true };
      const update_doll_Doc = {
        $set: {
          name: Update_doll.name,
          price: Update_doll.price,
          category: Update_doll.category,
          select:Update_doll.select,
          seller_same:Update_doll.seller_same , 
          update_rating:Update_doll.update_rating , 
          update_quantity:Update_doll.update_quantity , 
          update_description:Update_doll.update_description , 
          update_seller_email:Update_doll.update_seller_email , 
          photo:Update_doll.photo
        },
      };
      const result = await Disney_Doll_All_Data.updateOne(filter, update_doll_Doc, options);
      res.send(result)
      // console.log('clear', update_user);
    })
  
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Disney Doll is running')
})



app.listen(port, () => {
  console.log(`Disney Doll  is running on port ${port}`)
})

// 
// 
// 
// 

