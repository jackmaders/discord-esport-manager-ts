# syntax = docker/dockerfile:1

# Define Bun version arg. This will be overridden by --build-arg in CI/CD
ARG BUN_VERSION=1.2.2
FROM oven/bun:${BUN_VERSION}-slim AS base

# ---- Build Stage ----
FROM base AS build
WORKDIR /app

# Install all dependencies (including devDependencies needed for build)
COPY package.json bun.lock ./
# Use --ci for faster installs based on lockfile
RUN bun install --ci

# Copy the rest of the application code
# Ensure .dockerignore excludes unnecessary files (.git, .vscode, etc.)
COPY . .

# Set production environment
ENV NODE_ENV="production"

# Generate Prisma client
RUN bunx prisma generate

# Build the application, bundling dependencies into ./dist
RUN bun run build

# ---- Final Stage ----
FROM base
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Copy only the bundled code from the build stage
COPY --from=build /app/dist /app/dist

# Run the bundled application
# Bun can directly execute the JS file
CMD [ "bun", "dist/index.js" ]
