import readline from 'readline'
import bsky, { RichText } from '@atproto/api';
import agent from './agent.js';
import { getParentPost } from './getParentPost.js';

const singleimg = async (agent, imgPath: string) => {
  return null
}

// ts-node-esm singleimg.ts | xargs wsl wget -O "<image>.jpeg"
// my terminal setup is cursed lmao

// We've found where an image is stored in a post that's already online, now we need to figure out how to create a post with an embedded image in the same place.
// use appbskyfeedpost to verify before attempting any posting

const imgPostRecord = {
  $type: 'app.bsky.feed.post',
  text: "test",
  embed: {
    images: [
      {
        fullsize: "placeholder.png",
        thumbnail: "placeholder.png",
        alt: ""
      }
    ]
  }
}




const template = await getParentPost("https://staging.bsky.app/profile/onsu.re/post/3jtykqflsbq2n")

if (!template) {
  console.log("Parent post not found.")
  process.exit(1)
}

if (bsky.AppBskyFeedPost.isRecord(template.post.record)) {
  console.log("Record is valid.")
} else { 
  console.log("Record is invalid.")
}

const templateRecord = template.post.record
console.log(templateRecord)

const templateEmbed = JSON.parse(JSON.stringify(templateRecord)).embed

console.log(templateEmbed.images[0])

// You can put anything in the embed, which is maybe dangerous.
// Still trying to figure out putting an actual image in there.

const imgCID = "bafkreiguqfu465dqtnzullorgpoevq36wrfqgtlq2lxrwuowq7eisxuera"

await agent.post({
  $type: 'app.bsky.feed.post',
  text: "this probably won't work",
  embed: {
    $type: 'app.bsky.feed.embed',
    images: [
      {
        fullsize: `${imgCID}`,
        thumbnail: "https://pbs.twimg.com/media/FuRlHQ9aIAAZ2Gu?format=jpg&name=small",
        alt: ""
      }
    ]
  }
})