const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔥 BACKEND WITH SOFT DELETE RUNNING 🔥");

// DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
});

const TABLE_NAME = "Todos";

/**
 * GET /todos
 * Return ONLY non-deleted todos
 */
app.get("/todos", async (req, res) => {
  try {
    const data = await dynamoDB.scan({
      TableName: TABLE_NAME,
      FilterExpression:
        "attribute_not_exists(deleted) OR deleted = :false",
      ExpressionAttributeValues: {
        ":false": false,
      },
    }).promise();

    res.json(data.Items || []);
  } catch (err) {
    console.error("GET error:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

/**
 * POST /todos
 * Create todo (deleted = false)
 */
app.post("/todos", async (req, res) => {
  const todo = {
    id: Date.now().toString(),
    text: req.body.text,
    completed: false,
    deleted: false,
    createdAt: new Date().toISOString(),
  };

  try {
    console.log("Saving:", todo);

    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: todo,
    }).promise();

    res.status(201).json(todo);
  } catch (err) {
    console.error("POST error:", err);
    res.status(500).json({ error: "Failed to add todo" });
  }
});

/**
 * DELETE /todos/:id
 * SOFT DELETE (NO DATA LOSS)
 */
app.delete("/todos/:id", async (req, res) => {
  try {
    console.log("Soft deleting ID:", req.params.id);

    await dynamoDB.update({
      TableName: TABLE_NAME,
      Key: { id: req.params.id },
      UpdateExpression: "SET deleted = :true, deletedAt = :time",
      ExpressionAttributeValues: {
        ":true": true,
        ":time": new Date().toISOString(),
      },
    }).promise();

    res.json({ message: "Todo soft-deleted" });
  } catch (err) {
    console.error("DELETE error:", err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(5001, () => {
  console.log("Backend running on http://localhost:5001");
});
