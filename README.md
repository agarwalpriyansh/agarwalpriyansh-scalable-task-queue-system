# 🚖 Distributed Ride Booking System

A scalable **distributed ride booking system** built using a microservices architecture.  
This project demonstrates **asynchronous task processing, atomic locking, and fault tolerance** using multiple independent services.

---

## 🧠 Overview

This system simulates how platforms like Uber/Ola handle ride requests:

- User requests a ride  
- System creates a **Task ID instantly**  
- Background workers assign drivers  
- Result is stored and can be queried later  

---

## 🏗️ Architecture
- Client → API Gateway → Task Service → Worker Service → Driver Service → Ride Service

---

## 🧩 Components (5 Services)

### 1️⃣ API Gateway (Producer)
- Accepts ride requests  
- Generates `task_id`  
- Sends task to Task Service  

---

### 2️⃣ Task Service (Broker)
- Manages task lifecycle  
- Ensures **no duplicate task execution**  
- Handles retry mechanism  

---

### 3️⃣ Worker Service 
- Polls tasks from Task Service  
- Fetches available drivers  
- Assigns driver using atomic locking  
- Handles retry logic  

---

### 4️⃣ Driver Service
- Manages driver availability  
- Implements **atomic locking**  
- Prevents multiple assignments of same driver  

---

### 5️⃣ Ride Service
- Stores ride details  
- Provides ride status  

---

## 🔥 Key Features

- Distributed microservices architecture  
- Asynchronous task processing  
- Atomic locking (prevents double booking)  
- Retry mechanism (fault tolerance)  
- Multiple worker support (scalable)  
- Independent services with network communication  

---

## 🔐 Atomic Locking

Driver locking is implemented using Redis `SET NX` (set-if-not-exists) with a TTL, ensuring only one worker can claim a driver at a time even under concurrent load.

---

## 🚀 Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js](https://nodejs.org/) v18+ 

---

### 1️⃣ Clone the Repository
```bash
git clone <repo-url>
cd agarwalpriyansh-scalable-task-queue-system
```

### 2️⃣ Run the Backend (Distributed Services)
The easiest way to run the entire backend stack (9 services) is using Docker Compose.

**Clean up existing containers (optional but recommended):**
```bash
docker-compose down -v
```

**Start all services:**
```bash
docker-compose up --build -d
```

**Verify services are up:**
```bash
docker-compose ps
```
Wait for all services to show `Up` (healthy). This may take ~30-45 seconds for RabbitMQ and Postgres to initialize.

### 3️⃣ Initialize Database (Automated)
The system is designed to be self-healing. The **Driver Service** will automatically run migrations and seed the initial drivers on startup. 

**Manual Override (Optional):**
If you ever need to manually reset or check the drivers, you can use these commands:
```bash
docker exec -it postgres psql -U postgres -d ride_booking -c "SELECT * FROM drivers;"
```

### 4️⃣ Run the Frontend
The frontend is a React application that communicates with the API Gateway.

```bash
cd ride-frontend
npm install
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 🛠️ Useful Commands & Information

### Service Ports
| Service | Internal Port | External Port | URL |
| :--- | :--- | :--- | :--- |
| **API Gateway** | 3000 | 3001 | http://localhost:3001 |
| **Task Service** | 5000 | 5000 | http://localhost:5000 |
| **Ride Service** | 4000 | 4000 | http://localhost:4000 |
| **Driver Service**| 8081 | 8081 | http://localhost:8081 |
| **RabbitMQ UI** | 15672| 15673| http://localhost:15673 (guest/guest) |
| **Postgres** | 5432 | 5435 | `localhost:5435` |
| **Redis** | 6379 | 6381 | `localhost:6381` |

### Monitoring & Logs
**View logs for all services:**
```bash
docker-compose logs -f
```

**View logs for a specific service (e.g., worker-service):**
```bash
docker-compose logs -f worker-service
```

### Testing
**Run End-to-End Test script:**
```bash
# From the root directory
node tests/e2e.test.js
```

---

## 🔐 Atomic Locking Implementation
Driver locking is implemented using Redis `SET NX` (set-if-not-exists) with a TTL, ensuring only one worker can claim a driver at a time even under concurrent load. This prevents the "Double Booking" problem in a distributed environment.