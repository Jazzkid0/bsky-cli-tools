// Replies to a post on bluesky.social from the command line.
// Usage: ts-node-esm reply.ts --reply-to "<link to post>" --text-content "<text content of reply>"

import readline from 'readline'
import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

const getParentPost = async (parentURL: string) => {

  const parentDomain = parentURL.split("/")[4]
  const parentPostID = parentURL.split("/")[6]

  const parentFeed = await agent.getAuthorFeed({actor: parentDomain})
  const parentPost = parentFeed.data.feed.find(post => post.post.uri.split("/")[4] === parentPostID)

  if (parentPost) {
    return parentPost
  } else {
    return undefined
  }
}

const postReply = async (agent, textcontent: string, parentRootURI: string, parentRootCID: string, parentURI: string, parentCID: string) => {
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

// Very inefficient way to find the post, but it works with just the URL. I'm sure there's a better way to do this.
export const reply = async (agent, textcontent: string, parentURL: string) => {

  const parentPost = await getParentPost(parentURL)
  
  if (!parentPost) {
    console.error("ERROR: Could not find parent post.")
    process.exit(1)
  }

  const parentURI = parentPost.post.uri
  const parentCID = parentPost.post.cid
  
  let parentRootURI = parentURI;
  let parentRootCID = parentCID;
  if (parentPost.reply) {
    const parentData = JSON.parse(JSON.stringify(parentPost.reply));
    parentRootURI = parentData.root.uri;
    parentRootCID = parentData.root.cid;
  }

  await postReply(agent, textcontent, parentRootURI, parentRootCID, parentURI, parentCID)
}


const replyflag = process.argv.indexOf('--reply-to') !== -1

const parentURL = process.argv[process.argv.indexOf('--reply-to') + 1];

const textcontentflag = process.argv.indexOf('--text-content') !== -1;

const textcontent = process.argv[process.argv.indexOf('--text-content') + 1];

if (!textcontentflag || !textcontent || !replyflag || !parentURL) {
  console.error("ERROR: Please provide a text content for the bleet with the --text-content flag, and a parent post with the --reply-to flag.")
  process.exit(1)
}

const parentPost = await getParentPost(parentURL)

if (!parentPost) {
  console.error("ERROR: Could not find parent post.")
  process.exit(1)
}

const parentHandle = JSON.parse(JSON.stringify(parentPost.post.author)).handle

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log(`Replying to ${parentHandle}'s post at ${parentURL} with the text content:\n----------\n${textcontent}\n----------`)
rl.question(`Are you sure you want to post this reply to ${parentHandle}'s post? (Type SEND to confirm) `, (answer) => {
  if (answer === "SEND") {
    console.log("Posting reply...")
    reply(agent, textcontent, parentURL)
    console.log("Reply hopefully posted successfully.")
    rl.close()
  } else {
    console.log("Cancelled.")
    rl.close()
    process.exit(1)
  }
})



