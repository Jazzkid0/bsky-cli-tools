// Use this to post a bleet from the command line.
// Usage: ts-node-esm bleet.ts "Your bleet here"

import readline from 'readline'
import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();

const bleet = process.argv[2];

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

async function postBleet(bleet: string) {
  await agent.post({
    text: bleet,
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log(`\nPosting the following content:\n----------\n${bleet}\n----------`)
rl.question(`Are you sure you want to post? (Type SEND to confirm) `, (answer) => {
  if (answer === "SEND") {
    console.log("Posting...")
    postBleet(bleet)
    rl.close()
  } else {
    console.log("Cancelled.")
    rl.close()
    process.exit(1)
  }
})