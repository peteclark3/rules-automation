# First, Thank you!
The accompanying presentation for this submission is [here](https://docs.google.com/presentation/d/19xOeXDpxPrlkXCfAEZkP9zr1EjsgKibXvrQOfHBeiZM/edit?usp=sharing).

**_And now, here beginneth the readme..._**

# Rules Automation System

This project is a simple rules automation system for managing document requests based on application conditions.

## Overview

This system allows schools to:
- Create and manage document request rules
- Automatically evaluate applications against rules
- Generate document requests based on matching conditions

## Setup & Running

### Prerequisites 
#### For Running
- [Docker](https://docs.docker.com/get-docker/)
#### For Local Development
- Node.js 18+ (for local frontend development)
- Python 3.11+ and Poetry (for local backend development)

Running with Docker:
1. Clone this repository
2. From the repo root, start all services with: 
```shell
docker-compose up -d
``` 
3. After waiting an age for the frontend to start, run the first migration to create the database schema:    
```shell
docker exec -i rules-automation-db-1 psql -U rules_user -d rules_db < backend/migrations/001_initial_schema.sql
  ```
4. Run the second migration to load sample data:    
```shell
docker exec -i rules-automation-db-1 psql -U rules_user -d rules_db < backend/migrations/002_sample_data.sql
```
5. Access the rules maker at http://localhost:3000
6. Access the (very basic!) application submission page at http://localhost:3000/apply
7. Watch logs with `docker-compose logs -f`
8. Stop everything with `docker-compose down`

## Known Issues
1. When creating a rule, it does not validate that there isn't a conflicting rule, it just creates it.  This can create unexpected behavior.
2. The application submission page is extremely basic and just exists to test the rule engine.
3. The system does not implement the full architecture specified in the presentation (noted in the presentation also). 
4. Kube manifest files are not included.
5. Logging and monitoring are not implemented.
6. There are no unit tests. :( 

## Local Development
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
