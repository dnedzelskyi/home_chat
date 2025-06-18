# Home Chat

Simple chat application.

## Features

- Real-time messaging
- WebSocket support
- REST API for settings and messages
- SQLite database for message storage
- Auto-generated SSL certificates for development

## Project Structure

```
client/         # Frontend code
server/         # Backend code
configs/        # Configuration files
schema/         # Database schema files
utils/          # Utility scripts
```

## Running the App

### Using Docker Compose

```bash
# Gen ssl certificates for https
mkdir -p "/etc/home_chat/certs"
openssl req -x509 -nodes \
  -days 365 \
  -newkey rsa:2048 \
  -subj "/C=US/ST=CA/L=SF/O=LocalDev/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
  -keyout /etc/home_chat/certs/nginx.key \
  -out /etc/home_chat/certs/nginx.crt

# Run
docker compose up --build
```

### Development Mode

```bash
npm run dev
```

### Configuration

- **Development**: `configs/development.json`
- **Production**: `configs/production.json`

### Database

- **Development**: SQLite database file located at `chat.db`
- **Production**: SQLite database file located at `db/chat.db` (persisted using docker volumes)

### SSL Certificates

- **Development**: Auto-generated and stored in `certs/`
- **Production**: Bind-mounted from `/etc/home_chat/certs` on the host machine.
