import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "Todos";

export const handler = async (event) => {
  const method = event.requestContext?.http?.method;
  const path = event.rawPath;

  try {
    // GET /todos
    if (method === "GET" && path === "/todos") {
      const data = await dynamo.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: "attribute_not_exists(deleted) OR deleted = :d",
          ExpressionAttributeValues: {
            ":d": false
          }
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify(data.Items || [])
      };
    }

    // POST /todos
    if (method === "POST" && path === "/todos") {
      const body = JSON.parse(event.body);

      const todo = {
        id: Date.now().toString(),
        text: body.text,
        completed: false,
        deleted: false,
        createdAt: new Date().toISOString()
      };

      await dynamo.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: todo
        })
      );

      return {
        statusCode: 201,
        body: JSON.stringify(todo)
      };
    }

    // DELETE /todos/{id} (soft delete)
    if (method === "DELETE" && path.startsWith("/todos/")) {
      const id = path.split("/")[2];

      await dynamo.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id },
          UpdateExpression: "SET deleted = :d, deletedAt = :t",
          ExpressionAttributeValues: {
            ":d": true,
            ":t": new Date().toISOString()
          }
        })
      );

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Todo deleted" })
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Route not found" })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};

