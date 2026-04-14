# BookNest - Complete Integration Running Guide

Quick start to run BookNest frontend integrated with all microservices.

## Prerequisites

- **Java 11+** (for backend services)
- **Node.js 22+** (for frontend)
- **MySQL 8+** (for database)
- **Maven** (for building Java services)

---

## Starting the Backend Services

### 1. Start Eureka Discovery Server
```bash
cd BookNest/eureka-server
mvn spring-boot:run
```
- Accessible at: `http://localhost:8761`

### 2. Start Individual Microservices

Open new terminal windows and run each command:

**Auth Service** (port 8081)
```bash
cd BookNest/auth-service
mvn spring-boot:run
```

**Book Service** (port 8082)
```bash
cd BookNest/book-service
mvn spring-boot:run
```

**Cart Service**
```bash
cd BookNest/cart-service
mvn spring-boot:run
```

**Order Service**
```bash
cd BookNest/order-service
mvn spring-boot:run
```

**Wallet Service**
```bash
cd BookNest/wallet-service
mvn spring-boot:run
```

**Review Service**
```bash
cd BookNest/review-service
mvn spring-boot:run
```

**Wishlist Service**
```bash
cd BookNest/wishlist-service
mvn spring-boot:run
```

**Notification Service**
```bash
cd BookNest/notification-service
mvn spring-boot:run
```

### 3. Start API Gateway (Last!)
```bash
cd BookNest/api-gateway
mvn spring-boot:run
```
- Accessible at: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## Starting the Frontend

### In the BookNest-Frontend directory:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5176` (or next available port)

---

## Verify Integration

### ✅ Check All Services Running

**Eureka Dashboard:** `http://localhost:8761`
- Should show all 8 microservices registered and UP

### ✅ Test API Gateway
```bash
# Get all books
curl http://localhost:8080/api/books

# Healthcheck
curl http://localhost:8080/actuator/health
```

### ✅ Test Frontend Connectivity
1. Open `http://localhost:5176` in browser
2. Register a new user
3. Login
4. Add books to cart
5. Place order
6. Check wallet

---

## Using Docker (Optional)

To run all services using Docker Compose:

```bash
cd BookNest
docker-compose up -d
```

Services will start automatically with proper networking.

---

## Common Issues

### ❌ "Port 8080 in use"
```bash
# Find and kill process using port 8080
lsof -i :8080
kill -9 <PID>
```

### ❌ "Database connection failed"
- Ensure MySQL is running
- Check connection strings in each service's `application.yml`
- Default creds: `root`/`1234`

### ❌ "Service not registered in Eureka"
- Wait 30 seconds for service registration
- Check service logs for startup errors

### ❌ "401 Unauthorized on frontend"
- Ensure JWT token is stored in localStorage after login
- Check browser DevTools → Application → localStorage

---

## Development Workflow

### Frontend Development
```bash
npm run dev      # Start dev server
npm run lint     # Lint code
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
Each microservice can be developed independently:
```bash
# From within a service directory
mvn clean install
mvn spring-boot:run
```

---

## API Documentation

Once all services are running, access Swagger UI:
- **Full API Docs:** `http://localhost:8080/swagger-ui.html`
- **API Gateway:** `http://localhost:8080/v3/api-docs`
- **Individual Services:** `http://localhost:808X/v3/api-docs`

---

## Useful Backend Endpoints

### Admin/Analytics (Protected)
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/admin/analytics/stats
```

### Book Catalog
```bash
# Get all books
curl http://localhost:8080/api/books

# Search books
curl "http://localhost:8080/api/books/search?keyword=java"

# Get featured books
curl http://localhost:8080/api/books/featured
```

### Authentication
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## Performance Optimization

### Frontend
- Minified build: `npm run build`
- Asset size: `npm run build -- --analyze`

### Backend
- Monitor service metrics: `http://localhost:8080/actuator/metrics`
- Database query optimization in Hibernate
- Connection pooling configured in each service

---

## Production Deployment

### Environment Variables
Set these before deployment:

```bash
# Database
DATABASE_URL=<mysql-connection-string>
DATABASE_USER=<db-user>
DATABASE_PASSWORD=<db-password>

# Eureka
EUREKA_SERVER_URL=<eureka-server-url>

# Frontend
VITE_API_BASE_URL=https://api.booknest.com/api

# Security
JWT_SECRET=<your-secret-key>
```

### Docker Production Build
```bash
# Build all services
docker-compose -f docker-compose.prod.yml up -d
```

---

## Monitoring

### Logs
```bash
# Frontend logs
npm run dev -- --debug

# Backend logs
# Check console output from each mvn spring-boot:run command
```

### Health Checks
```bash
# API Gateway health
curl http://localhost:8080/actuator/health

# Individual service health
curl http://localhost:808X/actuator/health
```

---

## Support

For detailed information, see:
- `BookNest/README.md` - Backend documentation
- `BookNest-Frontend/INTEGRATION_GUIDE.md` - Frontend integration details
- `BookNest/api-gateway/README.md` - API Gateway documentation

---

**Last Updated:** April 13, 2026
**Status:** ✅ Ready for Development/Testing
