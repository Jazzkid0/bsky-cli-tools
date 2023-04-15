// This is the basic structure for retrieving posts from a user's feed. It just gets my latest post, and prints the text content to the console.

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

const posts = await agent.getAuthorFeed({actor: 'jazzkid.bsky.social'})
const last = (posts.data.feed[0].post)

console.log(last)

console.log(JSON.parse(JSON.stringify(last.record)).text)


