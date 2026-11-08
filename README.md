# Shubh Deepavali

An interactive Diwali celebration featuring a 3D diya, the story of Diwali,
fireworks, a virtual diya wall, a rangoli maker, and personalized greetings.

Created by **Harish Kumar** · [LinkedIn](https://www.linkedin.com/in/harish-k-v10) ·
[GitHub](https://github.com/harish-KV-0506)

## Personalized wishes

Enter a recipient's name and create a shareable link. The greeting is stored in
the URL fragment, so it works on any device without a login, database, or
server-side storage. Anyone with the unlisted link can view the greeting; it is
not access-controlled.

## Run locally

Install [Bun](https://bun.sh/), then run:

```sh
bun install
bun run dev
```

## Deploy to GitHub Pages

The GitHub Actions workflow enables Pages, builds, and deploys the static site
when changes are pushed to `main` or when manually triggered. For a project
repository, the site URL is `https://<owner>.github.io/<repository>/`. The
workflow needs `pages: write` and `id-token: write` permissions.
