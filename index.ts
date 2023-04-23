// This is the basic structure for retrieving posts from a user's feed. It just gets my latest post, and prints the text content to the console.

import bsky, { AtpSessionEvent, AtpSessionData } from '@atproto/api';
import agent from "./agent.js";

const posts = await agent.getAuthorFeed({actor: 'jazzkid.bsky.social'})
const last = (posts.data.feed[0].post)

console.log(last)

console.log(JSON.parse(JSON.stringify(last.record)).text)


