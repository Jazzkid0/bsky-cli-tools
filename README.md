# Bluesky CLI stuff

This is a rough collection of tools for interacting with the Bluesky API from the command line. It's not at all polished.

I'm using this repo to learn, and you can too!
Use it as a template or fork at your leisure, and feel free to ask me about it on Bluesky: @jazzkid.bsky.social

## Usage

### Installation

```git clone``` this repo, your fork, or generation from the template.

```cd``` into the directory.

```npm install``` to install dependencies.

### Running Scripts from the command line

#### Basic posting
- From the root directory, run ```ts-node-esm bleet.ts "Your post here"```

#### Replying to others

- Copy the URL of the post you want to reply to.

- From the root directory, run ```ts-node-esm reply.ts --reply-to "<URL>" --text-content "Your message here"```

### More to come soon!

Feel free to post an issue if you have a feature request.
Here are the current plans:

- Custom posts with embedding

- Custom posts with images (Avoiding the web crop issues, hopefully)

- Quote posts

---

Bluesky API documentation can be found here: [https://github.com/bluesky-social/atproto/tree/main/packages/api](https://github.com/bluesky-social/atproto/tree/main/packages/api)

This is built from code provided by **Alice**! She's on bluesky too: @aliceisjustplaying.bsky.social
