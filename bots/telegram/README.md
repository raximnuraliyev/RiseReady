# RiseReady Telegram Bot

This folder contains a lightweight Telegram bot scaffold (Telegraf) used to bridge RiseReady with Telegram users.

Quick start:

1. Copy `.env.example` to `.env` and set `TELEGRAM_TOKEN` and `BACKEND_URL`.
2. From this folder run `npm install` then `node src/index.js`.

This bot implements simple commands that call the backend API under `/api/bots/telegram/*`.
