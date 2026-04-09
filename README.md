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

## 🚀 Running the E2E Test Locally

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Node.js](https://nodejs.org/) v18+ installed

### Steps

**1. Clone the repository**
```bash
git clone <repo-url>
cd agarwalpriyansh-scalable-task-queue-system
```

**2. Remove any stale containers (if re-running)**
```bash
docker rm -f postgres redis 2>nul
docker-compose down -v
```

**3. Start all services**
```bash
docker-compose up --build -d
```

Wait ~30 seconds for all services to become healthy. You can verify with:
```bash
docker-compose ps
```
All 9 services should show `Up`.

**4. Set up the database schema**

The `drivers` table must be created manually before running the test:
```bash
docker exec -it postgres psql -U postgres -d ride_booking -c "CREATE TABLE IF NOT EXISTS drivers (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), latitude DOUBLE PRECISION NOT NULL, longitude DOUBLE PRECISION NOT NULL, status VARCHAR(50) DEFAULT 'available');"
```

**5. Run the E2E test**
```bash
node tests/e2e.test.js
```

You should see output like: