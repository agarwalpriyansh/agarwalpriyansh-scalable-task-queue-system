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
- Manages task lifecycle:  

- Ensures **no duplicate task execution**  
- Handles retry mechanism  

---

### 3️⃣ Worker Service (Golang)
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

