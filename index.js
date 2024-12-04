import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// initialize the express app

const app = express();

app.use(express.json());
dotenv.config();
app.use(cors(corsOptions));

var corsOptions = {
  origin: ["http://localhost:3000","simple-template-apps.vercel.app"],
  credentials: true,
};


app.get("/", (req, res) => {
  res.send("hello")
})

// mongodb connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connected..");
  })
  .catch((err) => {
    console.log("error", err);
  });

// schema connection
const TemplateSchema = new mongoose.Schema({
  name: String,
  content: String,
  created_at: { type: Date, default: Date.now },
  type: String,
});

const Template = mongoose.model("Template", TemplateSchema);

// Routes for CRUD operations

// Create a new template
app.post("/templates", async (req, res) => {
  const { name, content } = req.body;
  try {
    const template = new Template({ name, content });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: "Error creating template" });
  }
});

// Read all templates
app.get("/templates", async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ error: "Error fetching templates" });
  }
});

// Update a template by ID
app.put("/templates/:id", async (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;
  try {
    const updatedTemplate = await Template.findByIdAndUpdate(
      id,
      { name, content },
      { new: true }
    );
    res.status(200).json(updatedTemplate);
  } catch (error) {
    res.status(500).json({ error: "Error updating template" });
  }
});

// Delete a template by ID
app.delete("/templates/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Template.findByIdAndDelete(id);
    res.status(200).json({ message: "Template deleted" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting template" });
  }
});

app.listen(8000, () => console.log("App is running on port 8000"))