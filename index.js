const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://b9-a10-b9c50.web.app",
      "https://b9-a10-b9c50.firebaseapp.com",
    ],
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.azafshu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db("craftDB").collection("craft");
    const categoryCollection = client.db("craftDB").collection("category");

    // create data
    app.post("/craft", async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
    });

    // read data
    app.get("/craft", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });
    app.get("/craft/email/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await craftCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // update data
    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body;
      const craft = {
        $set: {
          itemname: updatedCraft.itemname,
          subcategory: updatedCraft.subcategory,
          description: updatedCraft.description,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          customization: updatedCraft.customization,
          processtime: updatedCraft.processtime,
          stockstatus: updatedCraft.stockstatus,
          useremail: updatedCraft.useremail,
          username: updatedCraft.username,
          photo: updatedCraft.photo,
        },
      };
      const result = await craftCollection.updateOne(filter, craft, options);
      res.send(result);
    });

    // delete data
    app.delete("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

    // user related api
    // app.post("/user", async (req, res) => {
    //   const user = req.body;
    //   console.log(user);
    //   const result = await userCollection.insertOne(user);
    //   res.send(result);
    // });

    // app.get("/user", async (req, res) => {
    //   const cursor = userCollection.find();
    //   const users = await cursor.toArray();
    //   res.send(users);
    // });

    app.get("/craft/category/:category", async (req, res) => {
      const query = { subcategory: req.params.category };
      const result = await craftCollection.find(query).toArray();
      res.send(result);
    });

    // get single category
    app.get("/category/id/:id", async (req, res) => {
      const categoryId = req.params.id;
      const query = { _id: new ObjectId(categoryId) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    // get categories
    app.get("/category", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Painting server is running");
});

app.listen(port, () => {
  console.log(`Painting server is running on port: ${port}`);
});
