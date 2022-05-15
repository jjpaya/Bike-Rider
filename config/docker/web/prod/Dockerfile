FROM node:lts-alpine AS builder
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./
COPY ./config/private/prod/super-secrets.env /
RUN export $(cat /super-secrets.env | xargs) && npm run build && rm -f /super-secrets.env

FROM br_server AS static
RUN python manage.py collectstatic

FROM nginx:stable-alpine
COPY --from=builder /app/dist/ /var/www/html/
COPY --from=static /app_data/static/ /var/www/static/
COPY ./config/nginx/nginx.prod.conf /etc/nginx/conf.d/default.conf
