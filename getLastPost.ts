import agent from './agent.js';

export const getLastPost = async (agent, actor: string) => {
  const feed = await agent.getAuthorFeed({actor: actor});
  return feed.data.feed[0].post;
}

const author = process.argv[2]

const lastPost = await getLastPost(agent, author);

console.log(lastPost)
console.log("\n\n\n")

console.log(`Last post from ${author}:`)
console.log(lastPost.record)
console.log("Embed content:")
console.log(JSON.parse(JSON.stringify(lastPost.record)).embed)
console.log("Scroll up for full details")
