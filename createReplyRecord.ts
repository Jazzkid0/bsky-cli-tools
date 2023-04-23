export const createReplyRecord = async (agent, textcontent: string, parentRootURI: string, parentRootCID: string, parentURI: string, parentCID: string) => {
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
