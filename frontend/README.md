# Rules Automation Frontend

Simple React frontend for managing document request rules.

## Local Development

1. Install Node.js 18+ if you haven't already

2. Install dependencies:
   npm install

3. Start development server:
   npm start

The application will open at http://localhost:3000 with hot reloading enabled.

## Docker Deployment

1. Make sure Docker is installed on your system

2. Build the Docker image:
   docker build -t rules-frontend .

3. Start the container:
   docker run -p 3000:80 rules-frontend

4. Open your browser and visit:
   http://localhost:3000

## Development Notes

The frontend uses:
- React 18 with TypeScript
- Material UI for components
- React Router for navigation

Main pages:
- / - List of rules
- /rules/new - Create new rule

## Environment Setup

Create a .env file in the frontend directory for local development:

REACT_APP_API_URL=http://localhost:8000

## Available Scripts

- npm start: Start development server
- npm build: Build for production
- npm test: Run tests
- npm run lint: Run linter
- npm run format: Format code

## Troubleshooting

If you see module not found errors:
- Delete node_modules and package-lock.json
- Run npm install again

If you can't connect to the backend:
- Check that the backend is running on port 8000
- Verify your .env configuration