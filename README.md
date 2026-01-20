# CleanFanatics - Home Services Booking System

A full-stack MERN application for an on-demand home services marketplace handling the complete booking lifecycle.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas

## Project Structure

```
cleanfanatics/
├── backend/          # Express.js API server
├── frontend/         # React + Vite application
└── README.md
```

## Getting Started

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Features

- **Customer**: Create bookings, view status, cancel bookings
- **Provider**: Accept/reject bookings, update status
- **Admin**: Override status, manual assignment, view logs

## Booking Status Flow

```
pending → assigned → accepted → in-progress → completed
                ↓
           cancelled
```
