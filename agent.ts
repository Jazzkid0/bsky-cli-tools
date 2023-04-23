import bsky, { AtpSessionData, AtpSessionEvent } from '@atproto/api';
const { BskyAgent } = bsky;
import * as dotenv from 'dotenv';
import process from 'node:process';
dotenv.config();

const agent = new BskyAgent({
  service: 'https://bsky.social',
  // persistSession: (evt: AtpSessionEvent, sess?: AtpSessionData) => {
  //   // Save the session data to a local file
  //   if (sess) {
  //     process.env.BSKY_SESSION = JSON.stringify(sess);
  //   }
  // }
});

await agent.login({
  identifier: process.env.BSKY_USERNAME!,
  password: process.env.BSKY_PASSWORD!,
});

export default agent