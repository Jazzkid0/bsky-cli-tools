import agent from "./agent.js";

export const getParentPost = async (agent, parentURL: string) => {

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

if (parentURL){
  const ppost = await getParentPost(agent, parentURL);

  if (!ppost) {
    console.error("ERROR: Could not find parent post.")
    process.exit(1)
  }

  console.log(ppost)
}

