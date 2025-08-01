#!/bin/bash

echo "Running backend tests..."
cd backend
python -m pytest tests/ -v --cov=. --cov-report=html --cov-report=term-missing
cd ..

echo "Tests completed!" 