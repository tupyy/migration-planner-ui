import express from "express";
import morgan from "morgan";
import { Time, sleep } from "#/common/time";

const app = express();

app.use(morgan("tiny"));

app.put("/api/credentials/:code", async (req, res) => {
  console.log(req.body);

  console.log("Testing VMware credentials...");
  await sleep(3 * Time.Second);

  let statusCode: number;
  switch (req.params.code) {
    case "204": // No Content
      statusCode = 204;
      break;
    case "400":
      /* One of the fields is empty: "Must pass url, username, and password"
       * It should have been 422. And 400 should be used, e.g., when "url" field is missing.
       */
      statusCode = 400;
      break;
    case "401": // Unauthorized
      statusCode = 401;
      break;
    case "422":
      statusCode = 422; // Unprocessable Entity (e.g. wrong URL)
      break;
    default:
      /* Currently, sent when:
       * - Fails connecting to the vCenter (Why 500?)
       * - Fails saving the credentials to the data-dir
       */
      statusCode = 500; // Internal Server Error
  }

  res.status(statusCode).send();
});

// For usage with vite-plugin-mix
export const handler = app;
