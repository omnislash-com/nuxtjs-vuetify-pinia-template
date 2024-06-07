# Nuxt-Vuetify-Pinia Minimal Template Starter

- Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
- Look at the [Vuetify 3 documentation](https://vuetifyjs.com/en/components/all/#containment) to learn more.
- Look at the [Pinia documentation](https://pinia.vuejs.org/core-concepts/) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Script Deployment

## Manual Deployment

### Run locally via Docker

1. Build the Docker image

```bash
docker build --progress=plain --no-cache -t <project-name>:dev --build-arg ENV=development .
docker build --progress=plain --no-cache -t <project-name>:staging --build-arg ENV=staging .
docker build --progress=plain --no-cache -t <project-name>:prod --build-arg ENV=production .
```

2. Run the Docker image

```bash
docker run -p 3000:3000 <project-name>:dev
docker run -p 3000:3000 <project-name>:staging
docker run -p 3000:3000 <project-name>:prod
```

### Deploy manually to GCP Cloud Run

#### DEV

1. Set up auth and project (for initial deploy)

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
gcloud config set project <gcp-resource-project-name>-dev
```

2. Tag the image:

```bash
docker tag <project-name>:dev us-central1-docker.pkg.dev/<gcp-resource-project-name>-dev/deploy/<project-name>
```

3. Upload the image:

```bash
docker push us-central1-docker.pkg.dev/<gcp-resource-project-name>-dev/deploy/<project-name>
```

4. Deploy to Cloud Run

```bash
gcloud run deploy <project-name> --image us-central1-docker.pkg.dev/<gcp-resource-project-name>-dev/deploy/<project-name>:latest --platform=managed --region=us-central1 --allow-unauthenticated --memory=2Gi --min-instances=0 --cpu=1
```

#### STAGING

1. Set up auth and project (for initial deploy)

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
gcloud config set project <gcp-resource-project-name>-staging
```

2. Tag the image:

```bash
docker tag <project-name>:staging us-central1-docker.pkg.dev/<gcp-resource-project-name>-staging/deploy/<project-name>
```

3. Upload the image:

```bash
docker push us-central1-docker.pkg.dev/<gcp-resource-project-name>-staging/deploy/<project-name>
```

4. Deploy to Cloud Run

```bash
gcloud run deploy <project-name> --image us-central1-docker.pkg.dev/<gcp-resource-project-name>-staging/deploy/<project-name>:latest --platform=managed --region=us-central1 --allow-unauthenticated --memory=2Gi --min-instances=0 --cpu=1
```

#### PRODUCTION

1. Set up auth and project (for initial deploy)

```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
gcloud config set project <gcp-resource-project-name>-prod
```

2. Tag the image:

```bash
docker tag <project-name>:prod us-central1-docker.pkg.dev/<gcp-resource-project-name>-prod/deploy/<project-name>
```

3. Upload the image:

```bash
docker push us-central1-docker.pkg.dev/<gcp-resource-project-name>-prod/deploy/<project-name>
```

4. Deploy to Cloud Run

```bash
gcloud run deploy <project-name> --image us-central1-docker.pkg.dev/<gcp-resource-project-name>-prod/deploy/<project-name>:latest --platform=managed --region=us-central1 --allow-unauthenticated --memory=2Gi --min-instances=0 --cpu=1
```
