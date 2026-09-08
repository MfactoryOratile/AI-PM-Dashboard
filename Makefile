.PHONY: install dev test backend frontend

install:
	python3 -m pip install -r backend/requirements.txt
	cd frontend && npm install

dev:
	@echo "Run 'make backend' and 'make frontend' in separate terminals."

backend:
	uvicorn backend.src.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

test:
	python3 -m pytest backend/tests