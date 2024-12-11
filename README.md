# Rules Automation System

A simple rules automation system for managing document requests based on application conditions.

## Overview

This system allows schools to:
- Create and manage document request rules
- Automatically evaluate applications against rules
- Generate document requests based on matching conditions

## Architecture

The system consists of:
- Frontend: React/TypeScript application
- Backend: FastAPI (Python) REST API
- Database: PostgreSQL for data persistence
- Monitoring: Prometheus/Grafana for metrics, ELK Stack for logging

## Local Development Setup

Prerequisites:
- Docker and Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ and Poetry (for local backend development)

To run the entire stack:

1. Clone this repository
2. Run docker-compose up
3. Access the application at http://localhost:3000

## Development Environment

Frontend Development:
1. cd frontend
2. npm install
3. npm start

Backend Development:
1. cd backend
2. poetry install
3. poetry shell
4. poetry run uvicorn main:app --reload

## Production Deployment

The application is designed to run in Kubernetes with:
- Horizontal Pod Autoscaling for both frontend and backend
- Prometheus/Grafana for metrics monitoring
- ELK Stack for centralized logging
- Ingress controllers for traffic management

## Database Schema

Main tables:
- rules: Stores rule definitions
- applications: Stores submitted applications
- document_requests: Stores generated document requests
- rule_conditions: Stores rule evaluation criteria

## API Documentation

The API documentation is available at /docs when running the backend server.

Key endpoints:
- POST /api/rules - Create new rule
- GET /api/rules - List all rules
- POST /api/applications - Submit new application
- GET /api/document-requests - List document requests

## Testing

Run backend tests:
- cd backend
- poetry run pytest

Run frontend tests:
- cd frontend
- npm test