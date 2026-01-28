require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// ==========================
// CONNECT TO MONGODB
// ==========================
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));
// ==========================
// MONGOOSE SCHEMA + MODEL

// ==========================
const PersonSchema = new mongoose.Schema({
name: String,
age: Number
});
const Person = mongoose.model("Person", PersonSchema);
// ==========================
// GET ALL PEOPLE
// ==========================
app.get("/", async (req, res) => {
const people = await Person.find();
res.json(people);
});
// ==========================
// ADD NEW PERSON
// ==========================
app.post("/", async (req, res) => {
const newPerson = await Person.create(req.body);
res.json(newPerson);
});
// ==========================
// UPDATE PERSON
// ==========================
app.put("/:id", async (req, res) => {
const updated = await Person.findByIdAndUpdate(
req.params.id,
req.body,
{ new: true }
);
res.json(updated);
});
// ==========================
// DELETE PERSON
// ==========================
app.delete("/:id", async (req, res) => {
await Person.findByIdAndDelete(req.params.id);
res.json({ message: "Person Deleted" });
});
// ==========================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})