import express from "express";
import * as time from "#/kitchensink/time";
import { sleep } from "#/kitchensink/utils";

const app = express();

app.put("/api/credentials/:id", async (req, res) => {
  console.log(req.body);

  await sleep(5 * time.Second)

  let statusCode = 200;
  let response:
    | { accepted: [] | ["url"] | ["url", "credentials"] }
    | Error
    | null = null;
  switch (req.params.id) {
    case "1":
      response = { accepted: ["url", "credentials"] };
      break;
    case "2":
      statusCode = 400;
      response = { accepted: ["url"] };
      break;
    case "3":
      statusCode = 400;
      response = { accepted: [] };
      break;
    default:
      statusCode = 500;
      response = new Error("Invalid scenario");
  }

  res.status(statusCode).json(response);
});

export const handler = app;
