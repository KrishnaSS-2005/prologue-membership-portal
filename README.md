# PROLOGUE Membership Portal

The official membership portal concept for **PROLOGUE — The Reading Club of LBSITW**.
It gives students a warm, editorial-style place to discover the club, browse its
activities and events, view highlights, and apply to become a member.

## What is included

- Responsive single-page experience for mobile and desktop
- PROLOGUE introduction, vision, and purpose
- Member benefits and opportunities
- Activities and upcoming/past event sections
- Gallery with an interactive lightbox
- Membership form with client-side validation and confirmation state
- Responsive navigation menu and event filter
- Contact details and social links
- Reduced-motion support and accessible focus states

## Run locally

From the project root:

```bash
pnpm install
pnpm --filter @workspace/prologue-membership-portal run dev
```

The Vite development server will print the local preview URL.

## Project structure

```text
src/
  App.tsx       # Page content and interactions
  index.css     # Visual system, responsive layout, and animations
public/         # Static public assets
```

The supplied PROLOGUE logo is referenced from `attached_assets/` through the
Vite asset alias configured in `vite.config.ts`.

## Build for deployment

```bash
pnpm --filter @workspace/prologue-membership-portal run build
```

The production files are created in `dist/public`.

## GitHub Pages publishing

1. Create a new GitHub repository, for example `prologue-membership-portal`.
2. Add this project to the repository and push the `main` branch.
3. In GitHub, open **Settings → Pages** and choose **GitHub Actions** as the
   source.
4. Add a workflow that installs pnpm dependencies, runs the build command above,
   and deploys `dist/public` with the official GitHub Pages actions.
5. Set the live URL in the submission template:

```text
Name: <your name>
GitHub Repository: https://github.com/<username>/prologue-membership-portal
Live Website (GitHub Pages): https://<username>.github.io/prologue-membership-portal/
```

For a project-site deployment, configure Vite's `base` to the repository path
in the GitHub Actions build step if the site is not being served from a custom
domain.