const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o1nca.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db('travel_buddy');
        const packageCollection = database.collection('package_detail');
        const userCollection = database.collection('users');

        //GET products API
        app.get('/package_detail', async (req, res) => {
            const cursor = packageCollection.find({});
            const details = await cursor.toArray();
            res.send(details);
        })

        //add users api
        app.post('/users', async (req, res) => {
            const order = req.body;
            const result = await userCollection.insertOne(order);
            res.send(result);
            console.log('Data Inserted')
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel Buddy Server is Running');
});

app.listen(port, () => {
    console.log('Server running successfully')
})