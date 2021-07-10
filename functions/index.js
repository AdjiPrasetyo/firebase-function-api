/* eslint-disable max-len */

const functions = require("firebase-functions");
const express = require("express");
// const cors = require("cors");

const app = express();
const admin = require("firebase-admin");
admin.initializeApp();

// get all data
app.get("/", async (req, res) => {
  const snapshot = await admin.firestore().collection("users").get();
  const users = [];
  snapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();

    users.push({id, ...data});
  });

  res.status(200).send(JSON.stringify(users));
});

// get data by id
app.get("/:id", async (req, res) => {
  const snapshot = await admin.firestore().collection("users").doc(req.params.id).get();
  const userId = snapshot.id;
  const userData = snapshot.data();
  res.status(200).send(JSON.stringify({id: userId, ...userData}));
});

// update data
app.put("/:id", async (req, res) => {
  const body = req.body;
  await admin.firestore().collection("users").doc(req.params.id).update({
    ...body,
  });
  res.status(200).send();
});

// post data
app.post("/", (req, res) => {
  const user = req.body;
  admin.firestore().collection("users").add(user);
  res.status(201).send();
});

app.delete("/:id", async (req, res) => {
  await admin.firestore().collection("users").doc(req.params.id).delete();
  res.status(200).send();
});

exports.user = functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
