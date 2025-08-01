.PHONY: help install test run clean docker-up docker-down

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && pip install -r requirements.txt

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

test: ## Run all tests
	@echo "Running backend tests..."
	cd backend && python -m pytest tests/ -v
	@echo "Running frontend tests..."
	cd frontend && npm test -- --run

test-backend: ## Run backend tests
	cd backend && python -m pytest tests/ -v

test-frontend: ## Run frontend tests
	cd frontend && npm test -- --run

run: ## Run both backend and frontend
	@echo "Starting backend..."
	cd backend && python manage.py runserver &
	@echo "Starting frontend..."
	cd frontend && npm run dev

run-backend: ## Run backend only
	cd backend && python manage.py runserver

run-frontend: ## Run frontend only
	cd frontend && npm run dev

migrate: ## Run database migrations
	cd backend && python manage.py migrate

makemigrations: ## Create database migrations
	cd backend && python manage.py makemigrations

superuser: ## Create superuser
	cd backend && python manage.py createsuperuser

docker-up: ## Start Docker containers
	docker-compose up --build

docker-down: ## Stop Docker containers
	docker-compose down

docker-clean: ## Clean Docker containers and volumes
	docker-compose down -v --remove-orphans

clean: ## Clean up generated files
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.pyc" -delete
	find . -type d -name "node_modules" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type f -name ".coverage" -delete

format: ## Format code
	@echo "Formatting Python code..."
	cd backend && black .
	@echo "Formatting JavaScript code..."
	cd frontend && npm run lint -- --fix

lint: ## Lint code
	@echo "Linting Python code..."
	cd backend && flake8 .
	@echo "Linting JavaScript code..."
	cd frontend && npm run lint 