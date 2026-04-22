FROM node:20-alpine
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit

# Copy pre-built dist and source assets
COPY dist ./dist
COPY public ./public

EXPOSE 3000
CMD ["npm", "start"]
