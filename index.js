const express = require("express");
const app = express(); 
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
require("colors");
const config = process.env;

// Mongo DB Connections
const uri = `mongodb+srv://${config.DB}:${config.PASS}@cluster0.telyg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client
  .connect()
  .then(() => {
    console.log("MongoDB Connected".blue.bold);
  })
  .catch((err) => {
    console.log(err.red);
  });

// Middleware Connections
const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json()); 

// Routes
async function run() {
  try {
    // collections are here
    const database = client.db("YOUR_DB");
    const glassCollection = database.collection("YOUR_COLLECTION"); 



    // Get glasses
    app.get("/glasses", async (req, res) => {
      const result = await glassCollection.find().toArray();
      res.send(result);
    });

    // Get glass By ID or All
    app.get("/glass/:id", async (req, res) => {
      const id = req.params.id;
      let result = null;
      if (id) {
        result = await glassCollection.findOne({ _id: new ObjectId(id) });
      } else {
        result = { message: "No data found by id:-" + id };
      }
      res.send(result);
    });

    // Create a new glass
    app.post("/glasses", async (req, res) => {
      const data = req.body;
      const result = await glassCollection.insertOne(data);
      res.send(result);
    });


    // Delete glass By ID
    app.delete("/glass/:id", async (req, res) => {
      const result = await glassCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

// Connection
const PORT = process.env.PORT || 7000;
app.get("/", (req, res) => {
  res.send("YOUR server is live");
});
app.listen(PORT, () => {
  console.log("App running in port: ".yellow + PORT);
});
