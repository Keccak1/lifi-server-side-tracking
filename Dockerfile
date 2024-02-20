###################
# STAGE 1: BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine AS development

WORKDIR /usr/src/app

# Set environment variables for PNPM store and PATH
ENV PNPM_STORE_PATH="/usr/src/app/.pnpm-store"
ENV PNPM_HOME="/usr/src/app/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copying package.json and pnpm-lock.yaml to utilize Docker cache
COPY package.json pnpm-lock.yaml* ./

# Install PNPM and install dependencies as root user
RUN npm install -g pnpm@latest
RUN pnpm config set store-dir $PNPM_STORE_PATH
RUN pnpm install

# Copying the rest of the code
COPY . .

# Build the application as root user
RUN pnpm run build

###################
# STAGE 2: BUILD FOR PRODUCTION
###################
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Set environment variables for PNPM store and PATH
ENV PNPM_STORE_PATH="/usr/src/app/.pnpm-store"
ENV PNPM_HOME="/usr/src/app/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install PNPM
RUN npm install -g pnpm@latest

# Copy package files and installed modules from the development stage
COPY --chown=node:node package.json pnpm-lock.yaml* ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/dist ./dist

# Copying the pnpm store from development
COPY --chown=node:node --from=development $PNPM_STORE_PATH $PNPM_STORE_PATH

# Create the directory and adjust permissions as root user before switching to node user
RUN mkdir -p "$PNPM_HOME" && chown -R node:node "$PNPM_HOME" && chown -R node:node /usr/src/app

# Set NODE_ENV to production
ENV NODE_ENV production

# Switch to non-root user
USER node

# Install production dependencies and prune store as node user
RUN pnpm install --frozen-lockfile && pnpm prune --prod

###################
# STAGE 3: PRODUCTION IMAGE
###################
FROM node:18-alpine AS production

WORKDIR /usr/src/app

# Set environment variables for PNPM store and PATH
ENV PNPM_STORE_PATH="/usr/src/app/.pnpm-store"
ENV PNPM_HOME="/usr/src/app/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Copy package files
COPY --chown=node:node package.json pnpm-lock.yaml* ./

# Copy node modules and build directory
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build $PNPM_STORE_PATH $PNPM_STORE_PATH

# Expose the port the app runs on
EXPOSE 8105

# Set non-root user
USER node

# Start the application
CMD ["node", "dist/main.js"]
