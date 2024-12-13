# Rules Automation System

This project is a simple rules automation system for managing document requests based on application conditions.

## Overview

This system allows schools to:
- Create and manage document request rules
- Automatically evaluate applications against rules
- Generate document requests based on matching conditions

## Setup & Running

Prerequisites:
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ and Poetry (for local backend development)

Running with Docker:
1. Clone this repository
2. Start all services with: `docker-compose up -d`
3. Run initial database schema:    
```shell
docker exec -i rules-automation-db-1 psql -U rules_user -d rules_db < backend/migrations/001_initial_schema.sql
  ```
4. Load sample data:    
```shell
docker exec -i rules-automation-db-1 psql -U rules_user -d rules_db < backend/migrations/002_sample_data.sql
```

5. Access frontend at http://localhost:3000
6. Access API docs at http://localhost:8000/docs

Local Development:

Frontend:
- Navigate to frontend directory
- Install dependencies with npm install
- Start development server with npm start
- Access the rules maker at http://localhost:3000
- Access the application submission page at http://localhost:3000/apply

Backend:
- Navigate to backend directory
- Install dependencies with poetry install
- Start virtual environment with poetry shell
- Run server with poetry run uvicorn app.main:app --reload
- Access at http://localhost:8000

## Features

Available Pages:
- Rules List: View and manage all rules
- Create Rule: Define new document request rules
- Submit Application: Test rule evaluation

API Endpoints:
- GET /rules - List all rules
- POST /rules - Create new rule
- GET /rules/{id} - Get specific rule
- DELETE /rules/{id} - Delete rule
- POST /applications - Submit application
