# Docco

**Instant documentation for your HTML.**

Docco is an open-source documentation platform that instantly turns your HTML files into a searchable, navigable documentation site. It is designed for speed, simplicity, and extensibility, making it easy to publish and maintain documentation for any project.

## Features

- ⚡ **Instant Import**: Convert HTML files into a beautiful documentation site in seconds.
- 🔍 **Full-Text Search**: Blazing-fast search powered by [Meilisearch](https://www.meilisearch.com/).
- 🧭 **Automatic Navigation**: Sidebar navigation is generated from your folder structure.
- 🖥️ **Modern UI**: Responsive, accessible, and customizable interface built with Next.js and Tailwind CSS.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (18+ recommended)
- [Bun](https://bun.sh/) (for CLI and development)
- [Docker](https://www.docker.com/) (for running Meilisearch)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/docco.git
cd docco
```

### 2. Local Meilisearch

Create initial environment variables

```bash
cp .env.example .env
cp web/.env.example web/.env
```

Create a meilisearch master key and update

- `MEILISEARCH_MASTER_KEY` in `.env`.
- `MEILISEARCH_API_KEY` in `web/.env`.

Start meilisearch with

```bash
docker-compose up -d
```

### 3. Start web app

Install dependencies and start web app

```bash
cd web
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Import Your Documentation

Use the CLI to import your HTML files:

```bash
cd ../cli
bun install
bun run index.ts content:create ./path/to/your/html
```

## Contributing

Contributions are welcome! Please open issues or pull requests.

## License

[MIT](LICENSE)
