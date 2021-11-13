const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

// middleWare
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.om5y9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("Database Connected Sucessfully");
        const database = client.db("squa_drone");
        const serviceCollection = database.collection("services");
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        const usersCollection = database.collection("users");

        //getting all the services/products api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        })

        //getting single service api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        //Inserting Single order Api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);

        })

        // getting all the orders Api
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        })

        // getting my orders Api
        app.get('/myOrders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })

        // deleting specific order Api
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await orderCollection.deleteOne(query);
            res.json(item);
        })

        //inserting a single review Api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

        //getting all reviews Api
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        })

        //inserting register user to user database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //upserting googole sign in user to user database
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };

            const updateDoc = {
                $set: user
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // setting the user as an admin from makeAdmin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }

            const updateDoc = {
                $set: {
                    role: "admin"
                }
            }
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        //Find out the admin and check it true for Admin route
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            else {
                isAdmin = false;
            }
            res.json({ admin: isAdmin })
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to Drone Zone!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})