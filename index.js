const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "https://luxury-restaurants.web.app/"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iua9cew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middlewares
const logger = async (req, res, next) => {
  console.log("called:", req.host, req.originalUrl);
  next();
};

async function run() {
  try {
    const allFoodsCollection = client
      .db("luxuryRestaurant")
      .collection("allFood");

    // jwt
    app.post("/jwt", logger, async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "255d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send({ success: true });
    });

    //clearing Token
    // app.post("/logout", async (req, res) => {
    //   const user = req.body;
    //   console.log("logging out", user);
    //   res
    //     .clearCookie("token", { ...cookieOptions, maxAge: 0 })
    //     .send({ success: true });
    // });

    // Get all data top Foods data from db
    app.get("/allFood", logger, async (req, res) => {
      const result = await allFoodsCollection.find().toArray();
      res.send(result);
    });
    // Get all data all Foods data from db
    app.get("/allFoods", logger, async (req, res) => {
      const result = await allFoodsCollection.find().toArray();
      res.send(result);
    });
    // Get all data all Foods data from db
    app.get("/gallery", logger, async (req, res) => {
      const result = await allFoodsCollection.find().toArray();
      res.send(result);
    });
    // get a single food data from db
    app.get("/singleFoodItem/:id", logger, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allFoodsCollection.findOne(query);
      res.send(result);
    });
    // Purchase save food data
    app.post("/purchaseFood", logger, async (req, res) => {
      const newFoodItem = req.body;
      const result = await allFoodsCollection.insertOne(newFoodItem);
      res.send(result);
    });

    // update  work here
    app.put("/updateFood/:id", logger, async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          food_Name: req.body.food_Name,
          food_Category: req.body.food_Category,
          food_origin: req.body.food_origin,
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
    app.post("/addFoodItem", logger, async (req, res) => {
      const newFoodItem = req.body;
      const result = await allFoodsCollection.insertOne(newFoodItem);
      res.send(result);
    });
    // get all food data by email
    app.get("/addMyFoods/:email", logger, async (req, res) => {
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
