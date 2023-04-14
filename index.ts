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

const thread = await agent.getPostThread({uri: 'at://bsky.social/jazzkid.bsky.social/post#/$3jtd5g5uuhr2o'});

console.log(thread);

// const fryes = 'https://staging.bsky.app/profile/jazzkid.bsky.social/post/3jtcy54ing22v';

// const bleet = 'Me, flexing: Google';
// await agent.post({
//   text: bleet,
//   entities: [
//     {
//       index: { start: 13, end: 19 },
//       type: 'link',
//       value: 'https://www.google.com',
//     },
//   ],
//   reply: {
//     root: {
//       uri: 'https://staging.bsky.app/profile/jazzkid.bsky.social/',
//       cid: '3jtcy54ing22v',
//     },
//     parent: {
//       uri: 'https://staging.bsky.app/profile/jazzkid.bsky.social/',
//       cid: '3jtcy54ing22v',
//     },
//   },
//   embed: {
//     $type: 'app.bsky.embed.external',
//     external: {
//       uri: 'https://www.google.com',
//       title: "Google",
//       description: "Google, but with whatever description I want >:)",
//     },
//   },
// });
