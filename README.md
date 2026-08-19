# LikeMinds Feed SDK for React

Drop-in social feed for React web apps. Posts, comments, likes, polls, topics and a full moderation
queue, with every component overridable.

[![npm](https://img.shields.io/npm/v/@likeminds.community/likeminds-feed-reactjs.svg)](https://www.npmjs.com/package/@likeminds.community/likeminds-feed-reactjs)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

**Docs:** https://docs.likeminds.io/

## What you get

Universal and personalised feeds · posts with text, images, video, documents and PDFs, link
previews, polls and custom widgets · comments with nested replies · likes with liker lists · topics
and topic-filtered feeds · @-mentions · save, pin, hide, repost · search · activity and notification
feed · report queues · background upload with progress and retry · push notifications.

**A real moderation surface:** a pending-post approval queue, a report queue, and a member-permissions
editor. Draft and temporary post save with retry is built in.

## Install

```bash
npm install @likeminds.community/likeminds-feed-reactjs
```

This is the UI layer. It depends on the data layer:

```bash
npm install @likeminds.community/feed-js
```

Source for the data layer is at
[likeminds-feed-js-data](https://github.com/LikeMindsCommunity/likeminds-feed-js-data).

## What is in this repo

| Directory | What it is |
|---|---|
| `core/` | The publishable SDK |
| `social-feed/` | Like-based social feed, with routing, a side nav, and a moderation screen gated on community-manager state |
| `qna-feed/` | Q&A feed with an upvote-labelled footer, a question-shaped composer, and component-override examples |

To run one:

```bash
cd social-feed
npm install
npm run dev
```

## Two feed shapes, genuinely separate

`LMSocialFeed` and `LMQNAFeed` have parallel implementations of the feed, composer, post body, footer
and poll dialog rather than one shape with flags. Pick the root that matches your product.

## Built on

React 18 · MUI 5 · Firebase · AWS S3 and Cognito · react-pdf

## Contributing

See the org-wide [contributing guide](https://github.com/LikeMindsCommunity/.github/blob/master/.github/CONTRIBUTING.md).
Security issues go to **hi@likeminds.community**, not the issue tracker.

## License

Apache 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
