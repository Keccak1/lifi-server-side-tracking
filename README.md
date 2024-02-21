# 🌐 LI.FI Homework Assignment Solution 🚀

This repository is the solution for LI.FI recruitment task, focusing on enriching server-side event tracking capabilities.

## 🎯 Assignment Overview

The mission was to implement server-side event tracking across three critical interactions within the Jumper exchange

- **a) Trading Actions**: Captures clicks on the “Exchange”, “Gas”, and “Buy” buttons, identifying the user's transaction choice.
- **b) Wallet Selection**: Monitors clicks on the “Wallet” logo, pinpointing the user’s wallet preference.
- **c) Widget Interactions**: Tracks various user interactions exposed by the LI.FI Widget interface.

This comprehensive endeavor integrates enhancements on both the backend and frontend spectrums, ensuring a seamless user experience.

🔒 **Note**: The current repository houses the **backend** part of this project. It's a Proof of Concept (POC) with simplifications meant for further development before hitting commercial use.

## 🛠 High-Level Description

The system is designed to ferry metric data to the backend, facilitating its transmission to Google Analytics and storage within a database. It guarantees flawless user identification and is versatile enough for future expansion concerning event processing methodologies.

## 🔧 Technical Overview

Metrics are dispatched via a REST API, with user identification managed through specialized cookies:

- **client_id**: A unique identifier stored as a cookie with a two-year lifespan.
- **session_id**: A session-specific ID lasting for 30 minutes.

### Endpoints at Your Service:

- `POST api/v1/auth/log-in`: Logs the user in.
- `GET api/v1/auth/is-logged-in`: Verifies if the user is logged in.
- `POST api/v1/auth/log-out`: Logs the user out.
- `POST api/v1/metrics`: For metric submission.

## 🎨 Implementation Description

Crafted with the innovative NestJS framework and leveraging MongoDB for data persistence, our architecture is built for efficiency:

- **Event Consumer**: The linchpin that routes events to their respective processors.
- **Event Processors**: Dedicated services, each implementing the `IMetricsProcessor` interface, poised for metric processing.

## 🚀 Setup Instructions

### Running the Service Solo

Ensure your environment variables are in check (see `env.example` for guidance).

- **Development Mode**: `pnpm run start:dev`
- **Production Mode**: `pnpm build && pnpm run start:prod`

### Docker Compose: Service + Database

Adjust your environment variables as needed (`compose.env.example` for the win!).

- Launch with: `docker-compose up`

## 🧪 Running Tests

Engage in quality control with:

- **unit tests**: `pnpm run test`
- **e2e tests**: `pnpm run test:e2e`
