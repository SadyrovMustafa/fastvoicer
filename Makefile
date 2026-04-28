.PHONY: help up down reset prod logs ps restart

help:
	@echo "VocalFlow Docker shortcuts"
	@echo "  make up      - start dev stack with build"
	@echo "  make down    - stop dev stack"
	@echo "  make reset   - stop and remove volumes"
	@echo "  make prod    - start production-style stack"
	@echo "  make logs    - follow logs"
	@echo "  make ps      - list services"
	@echo "  make restart - restart dev stack"

up:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

down:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down

reset:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v

prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

logs:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

ps:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml ps

restart: down up
