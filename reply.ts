// Replies to a post on bluesky.social from the command line.
// Usage: ts-node-esm reply.ts --reply-to "<link to post>" --text-content "<text content of reply>"

import readline from 'readline'
import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();

const reply = process.argv.indexOf('--reply-to') !== -1

const parentURL = process.argv[process.argv.indexOf('--reply-to') + 1];

const textcontentflag = process.argv.indexOf('--text-content') !== -1;

const textcontent = process.argv[process.argv.indexOf('--text-content') + 1];

if (!textcontentflag || !textcontent || !reply || !parentURL) {
  console.error("ERROR: Please provide a text content for the bleet with the --text-content flag, and a parent post with the --reply-to flag.")
  process.exit(1)
}

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});


// Get username and post ID from parent URL

const parentDomain = parentURL.split("/")[4]
const parentPostID = parentURL.split("/")[6]

// Get parent post

const parentFeed = await agent.getAuthorFeed({actor: parentDomain})
const parentPost = parentFeed.data.feed.find(post => post.post.uri.split("/")[4] === parentPostID)

if (!parentPost) {
  console.error("ERROR: Parent post not found.")
  process.exit(1)
}

// Get parent post's uri and cid

const parentURI = parentPost.post.uri
const parentCID = parentPost.post.cid
const parentHandle = JSON.parse(JSON.stringify(parentPost.post.author)).handle

// Get paren't post's root uri and cid

const parentData = JSON.parse(JSON.stringify(parentPost.reply))

const parentRootURI = parentData.root.uri
const parentRootCID = parentData.root.cid

console.log(`\nReplying to ${parentHandle} with the following content:\n----------`)
console.log(textcontent + "\n----------")

// Define sendReply function (async because it uses await and I wanna call it within a readline question)

async function sendReply() {
  await agent.post({
    text: textcontent,
    reply: {
      root: {
        uri: parentRootURI,
        cid: parentRootCID,
      },
      parent: {
        uri: parentURI,
        cid: parentCID,
      },
    },
  })
}

// Ask user to confirm

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question(`Are you sure you want to post this reply to ${parentHandle}'s post? (Type SEND to confirm) `, (answer) => {
  if (answer === "SEND") {
    console.log("Posting reply...")
    sendReply()
    console.log("Reply hopefully posted successfully.")
    rl.close()
  } else {
    console.log("Cancelled.")
    rl.close()
    process.exit(1)
  }
})



