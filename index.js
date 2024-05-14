const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iua9cew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const allFoodsCollection = client
      .db("luxuryRestaurant")
      .collection("allFood");

    // Get all data top Foods data from db
    app.get("/allFood", async (req, res) => {
      const result = await allFoodsCollection.find().toArray();
      res.send(result);
    });
    // Get all data all Foods data from db
    app.get("/allFoods", async (req, res) => {
      const result = await allFoodsCollection.find().toArray();
      res.send(result);
    });

    // get a single food data from db
    app.get("/singleFoodItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allFoodsCollection.findOne(query);
      res.send(result);
    });

    // update  work here
    app.put("/updateFood/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          food_Name: req.body.food_Name,
          food_Category: req.body.food_Category,
          food_Origin: req.body.food_Origin,
          price: req.body.price,
          quantity: req.body.quantity,
          description: req.body.description,
          image_Url: req.body.image_Url,
        },
      };
      const result = await allFoodsCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    // delete to the data work here
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allFoodsCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    // save a food data
    app.post("/addFoodItem", async (req, res) => {
      const newFoodItem = req.body;
      const result = await allFoodsCollection.insertOne(newFoodItem);
      res.send(result);
    });
    // get all food data by email
    app.get("/addMyFoods/:email", async (req, res) => {
      const email = req.params.email;
      const query = { "buyer.email": email };
      const result = await allFoodsCollection.find(query).toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("Hello Luxury Restaurant Server.........");
});

app.listen(port, () => console.log(`Server is Running on Port ${port}`));
