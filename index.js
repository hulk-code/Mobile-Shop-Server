const express=require('express')

const cors=require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT||5000
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bw2yndc.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const allPhoneCollection=client.db('PhoneShop').collection('AllPhoneData')
    const addToCartCollection=client.db('PhoneShop').collection('addToCartData');


    app.get('/phones', async (req, res) => {
        const result = await allPhoneCollection.find().toArray();
        res.send(result);
    })

   //data lode by specific id
    app.get('/phonesDetails/:id' , async(req ,res)=>{
      const id=req .params.id;
      const query={
        _id:new ObjectId(id)

      }
      const result=await allPhoneCollection.findOne(query)
      res.send(result)
    })
    
    //add to card data 
    app.post('/addToCart',async(req,res) =>{

      const {name, type, processor, memory, OS, price,email, img} = req.body;
      const document = {
        _id :new ObjectId(),
        email,
        name,
        img,
        type,
        processor,
        memory,
        OS,
        price,
      
      }
      const result = await addToCartCollection.insertOne(document);
      res.send(result);
    })

    
  //   app.get('/addToCart', async (req, res) => {
  //     const result = await addToCartCollection.find().toArray();
  //     res.send(result);
  // })

  app.get('/addToCart',async(req, res)=>{
    const email = req.query.email;
    console.log(email);
    const query = { email : email}
    const result = await addToCartCollection.find(query).toArray();
    res.send(result);
  })

  app.delete('/addTocart/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await addToCartCollection.deleteOne(query);
    res.send(result);
    })

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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})