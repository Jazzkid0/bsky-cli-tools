import bsky from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();

export const getLastPost = async (agent, actor: string) => {
  const feed = await agent.getAuthorFeed({actor: actor});
  return feed.data.feed[0].post;
}

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

const author = process.argv[2]

const lastPost = await getLastPost(agent, author);

console.log(`Last post from ${author}:`)
console.log(JSON.parse(JSON.stringify(lastPost.record)).text)