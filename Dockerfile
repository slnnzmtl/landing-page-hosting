# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build-stage

WORKDIR /app

# Lockfile is v6 (pnpm 8). Do not use Corepack: package.json pins pnpm 10,
# which ignores this lockfile. Regenerate the lockfile before switching to 10.
RUN npm install -g pnpm@8.15.9

# Full tree before install so postinstall (nuxt prepare) has sources.
COPY . .

ENV HUSKY=0
ENV CI=true

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

ARG NUXT_PUBLIC_SITE_URL=https://kazansky.dev
ARG DIRECTUS_URL=https://cms.kazansky.dev
ARG UMAMI_WEBSITE_ID=
ARG NUXT_UMAMI_WEBSITE_ID=

ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV DIRECTUS_URL=$DIRECTUS_URL
ENV UMAMI_WEBSITE_ID=$UMAMI_WEBSITE_ID
ENV NUXT_UMAMI_WEBSITE_ID=$NUXT_UMAMI_WEBSITE_ID

# CMS copy is fetched at generate time, not from the build context.
# Changing this arg invalidates only the generate layer (install stays cached).
ARG CMS_CACHEBUST=0

# Tokens/URLs that must not appear in `docker history`.
RUN --mount=type=secret,id=DIRECTUS_TOKEN \
    --mount=type=secret,id=SURVEY_WEBHOOK_URL,required=false \
    export DIRECTUS_TOKEN="$(cat /run/secrets/DIRECTUS_TOKEN)" && \
    if [ -f /run/secrets/SURVEY_WEBHOOK_URL ]; then \
      export SURVEY_WEBHOOK_URL="$(cat /run/secrets/SURVEY_WEBHOOK_URL)"; \
    fi && \
    if [ -z "$DIRECTUS_TOKEN" ]; then \
      echo "DIRECTUS_TOKEN secret is required for nuxt generate" >&2; \
      exit 1; \
    fi && \
    pnpm generate

FROM nginx:1.25-alpine AS production-stage

COPY --from=build-stage /app/.output/public/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && mkdir -p /run/nginx /var/cache/nginx \
    && chmod -R 755 /usr/share/nginx/html \
    && nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
