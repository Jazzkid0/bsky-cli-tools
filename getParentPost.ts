import agent from "./agent.js";

export const getParentPost = async (parentURL: string) => {

  const parentDomain = parentURL.split("/")[4];
  const parentPostID = parentURL.split("/")[6];

  const parentFeed = await agent.getAuthorFeed({ actor: parentDomain });
  const parentPost = parentFeed.data.feed.find(post => post.post.uri.split("/")[4] === parentPostID);

  if (parentPost) {
    return parentPost;
  } else {
    return undefined;
  }
};

const parentURL = process.argv[2];

const ppost = await getParentPost(parentURL);

if (!ppost) {
  console.error("ERROR: Could not find parent post.")
  process.exit(1)
}

console.log(JSON.parse(JSON.stringify(ppost.post.record)).embed.images[0])