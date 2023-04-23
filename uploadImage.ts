import agent from "./agent.js";
import fs from "fs";

export const uploadImage = async (agent, image) => {
  agent.uploadBlob({

  })
}

const image = fs.readFileSync(process.argv[2]);

// get response from uploadBlob below in a promise chain:
await agent.uploadBlob(image, {encoding: "image/jpeg"}).then((response) => {
  console.log(response);
});