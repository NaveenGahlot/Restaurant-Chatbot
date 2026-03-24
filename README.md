# Restaurant Chatbot

A small Node.js chatbot for a restaurant menu. The app serves a basic web UI, accepts a user question, sends it to a LangChain agent backed by Google's Gemini model, and uses a custom tool to answer menu-related questions for `breakfast`, `lunch`, and `dinner`.

## Project Overview

This project contains:

- An Express server in `server.js`
- A simple frontend in `public/index.html`
- A LangChain tool called `getMenu` for fixed restaurant menu responses
- A Gemini-powered chat model via `@langchain/google-genai`

## How It Works

1. The browser sends a `POST` request to `/api/chat` with `{ "input": "..." }`
2. The Express server passes that input to a LangChain agent
3. The agent can call the `getMenu` tool when the question is about a meal category
4. The server returns the final text response as JSON
5. The frontend appends the exchange to the chat area

## Menu Data

The current menu is hardcoded inside `server.js`:

- `breakfast`: Aloo Paratha, Poha, Masala Chai
- `lunch`: Paneer Butter Masala, Dal Fry, Jeera Rice, Roti
- `dinner`: Veg Biryani, Raita, Salad, Gulab Jamun

## Tech Stack

- Node.js
- Express
- LangChain
- Google Gemini via `@langchain/google-genai`
- Dotenv

## Project Structure

```text
Restaurant Chatbot/
|-- public/
|   `-- index.html
|-- .env
|-- .gitignore
|-- package.json
|-- package-lock.json
|-- server.js
```

## Setup

### Prerequisites

- Node.js 18+ recommended
- A valid Google AI API key

### Install

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_ai_api_key
```

### Run

```bash
npm start
```

The server starts on:

```text
http://localhost:8080
```

## API

### `POST /api/chat`

Request body:

```json
{
  "input": "What's on the dinner menu?"
}
```

Example response:

```json
{
  "output": "Veg Biryani, Raita, Salad, Gulab Jamun"
}
```

## Frontend

The frontend is intentionally minimal:

- One text input
- One send button
- A chat area that displays user and bot messages

It communicates directly with the backend using `fetch("/api/chat")`.

## Current Limitations

- The menu is static and hardcoded
- There is no database or admin panel
- There is no chat history persisted between requests
- Input validation is minimal
- The UI is basic and not optimized for production use
- The project currently imports `zod` in `server.js`, so ensure it is available in dependencies if install issues appear

## Notes From Analysis

- The application is a good starter example for tool-calling with LangChain
- The agent is configured with `returnIntermediateSteps: true`, but the app only uses the first tool observation as fallback
- The root route serves `public/index.html` directly from the project root
- The repository currently contains a real API key in `.env`; it should be rotated and kept out of shared screenshots, commits, and docs

## Suggested Improvements

- Move menu items to a JSON file or database
- Add support for prices, categories, and availability
- Improve prompt instructions so the assistant stays restaurant-focused
- Add validation for missing `input`
- Add tests for `/api/chat`
- Add a `.env.example` file
- Improve the UI for mobile and conversational usability

## License

ISC
