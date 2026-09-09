# 🧠 YaadSaathi

### AI-Based Cognitive Gaming & Memory Assistance Platform

> **Technology with empathy for a more inclusive tomorrow.**

YaadSaathi is an AI-powered cognitive gaming and memory assistance platform designed to support older adults through engaging cognitive activities, personalized difficulty, reminders, and caregiver connectivity.

The platform focuses on making cognitive engagement **accessible, personalized, simple, and available even in low-connectivity environments**.

---

## 🌱 Why YaadSaathi?

As people age, maintaining cognitive engagement, daily routines, and social connection can become increasingly important.

However, many existing digital solutions are:

- Complex for elderly users
- Dependent on continuous internet connectivity
- Not personalized to individual abilities
- Difficult for families and caregivers to monitor

**YaadSaathi addresses these challenges through a simple, accessible and offline-first platform.**

---

## 🎯 Our Vision

To create an accessible digital companion that helps older adults stay:

**Engaged → Independent → Connected → Supported**

---

## ✨ Key Features

### 🧩 Cognitive Games
Interactive activities designed around:

- Memory
- Attention
- Pattern recognition
- Cognitive engagement

### 🎯 Adaptive Difficulty

The platform tracks user performance and dynamically adjusts activity difficulty based on:

- Accuracy
- Response time
- Individual progress

This creates a more personalized experience rather than providing the same difficulty level to every user.

### 🔔 Smart Reminders

Local reminders help users maintain important daily routines and activities.

### 🗣️ Accessible Interface

Designed specifically with accessibility in mind:

- Large buttons
- Simple navigation
- Voice guidance
- Hindi / English support
- Minimal cognitive load

### 📱 Offline-First Experience

Core functionality is designed to work without continuous internet connectivity.

Local data can be stored using SQLite and synchronized with the cloud when connectivity becomes available.

### 👨‍👩‍👧 Caregiver Connectivity

A caregiver-facing dashboard can provide visibility into:

- Activity progress
- Performance trends
- Engagement
- Important reminders

This helps families stay connected with their loved ones.

---

# 🏗️ System Architecture

```text
┌──────────────────────┐
│      Mobile App      │
│    React Native      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      API Layer       │
│   FastAPI + JWT      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Adaptive Cognitive  │
│       Engine         │
│ Memory • Attention   │
│ Pattern Recognition  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Data Layer       │
│ SQLite + PostgreSQL  │
└──────────────────────┘
