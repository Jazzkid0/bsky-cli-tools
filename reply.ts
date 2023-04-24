// Replies to a post on bluesky.social from the command line.
// Usage: ts-node-esm reply.ts --reply-to "<link to post>" --text-content "<text content of reply>"
// Warning: This code is very ugly. Sorry.

import readline from 'readline'
import agent from './agent.js';
import { getParentPost } from './getParentPost.js';

export const postReply = async (agent, textcontent: string, parentRootURI: string, parentRootCID: string, parentURI: string, parentCID: string) => {
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
  });
};

const getParentThreadData = async (agent, parentURL: string) => {
  const parentPost = await getParentPost(agent, parentURL)
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

  const parentHandle = parentPost.post.author.handle

  return {
    parentHandle,
    parentRootURI,
    parentRootCID,
    parentURI,
    parentCID,
  }
}
  

// Very inefficient way to find the post, but it works with just the URL. I'm sure there's a better way to do this.
export const postReplyFromUrl = async (agent, textcontent: string, parentURL: string) => {

  const { parentHandle, parentRootURI, parentRootCID, parentURI, parentCID } = await getParentThreadData(agent, parentURL)
  await postReply(agent, textcontent, parentRootURI, parentRootCID, parentURI, parentCID)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const replyWithConfirmation = async (agent: any, parentURL: string, textContent: string) => {
  const { parentHandle, parentRootURI,  parentRootCID, parentURI, parentCID } = await getParentThreadData(agent, parentURL)
  console.log(`Replying to ${parentHandle}'s post at ${parentURL} with the text content:\n----------\n${textContent}\n----------`)
  rl.question(`Are you sure you want to post this reply to ${parentHandle}'s post? (Type SEND to confirm) `, (answer) => {
    if (answer === "SEND") {
      console.log("Posting reply...")
      postReply(agent, textContent, parentRootURI, parentRootCID, parentURI, parentCID)
      console.log("Hopefully posted!");
      rl.close();
    } else {
      console.log("Cancelled.");
      rl.close();
      process.exit(1);
    }
  });
}

export const replyInterface = async (agent) => {
  rl.question("Paste the link to the post you want to reply to below:\n", async (parentURL) => {
    const parentPost = await getParentPost(agent, parentURL)
    if (!parentPost) {
      console.error("ERROR: Could not find parent post.")
      process.exit(1)
    }
    rl.question(`Type your reply content below:\n`, (textContent) => {
      if (!textContent) {
        console.error("ERROR: Please provide some text content.")
        process.exit(1)
      } else {
        replyWithConfirmation(agent, parentURL, textContent);
      }
    })
  })
}

const replyflag = process.argv.indexOf('--reply-to') !== -1

const parentURL = process.argv[process.argv.indexOf('--reply-to') + 1];

const textcontentflag = process.argv.indexOf('--text-content') !== -1;

const textcontent = process.argv[process.argv.indexOf('--text-content') + 1];

if (!textcontentflag || !textcontent || !replyflag || !parentURL) {
  replyInterface(agent);
} else {
  replyWithConfirmation(agent, parentURL, textcontent);
}

