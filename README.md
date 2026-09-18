# Launchpad Node 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node: >=22](https://img.shields.io/badge/node-%3E%3D22.0.0-green.svg)](https://nodejs.org/)
[![Organization](https://img.shields.io/badge/Organization-AARVAK--VSET-purple.svg)](https://github.com/AARVAK-VSET)
[![Event](https://img.shields.io/badge/TSJ%202026-Patch%20Wars-orange.svg)](https://github.com/AARVAK-VSET)

> **Launchpad Node** is a production-grade boilerplate for Node.js web applications, designed for rapid MVP prototyping, hackathons, and enterprise development. It comes pre-wired with multi-provider OAuth, session management, CSRF protection, and sample integrations for major web APIs.

---

## ⚡ Highlights

- **Authentication & Authorization**: Local auth (email/password with bcrypt) plus OAuth 2.0 logins:
  - Google, GitHub, Twitter, Facebook, Steam, OpenID Connect
- **Database Layer**: MongoDB integration with Mongoose ORM, connection caching, and session storage via `connect-mongo`.
- **API & AI Integrations**: Built-in client examples for:
  - Hugging Face Inference, LangChain, Stripe Payments, Twilio SMS, GitHub API, Google Drive & Sheets
- **Security by Default**:
  - CSRF protection via Lusca
  - Rate limiting with `express-rate-limit`
  - Secure HTTP headers
  - Input validation and sanitization
- **UI & Templating**: Server-rendered Pug templates with Bootstrap 5 and FontAwesome.

---

## 🛠️ Prerequisites

- **Node.js**: `v22.x` or higher
- **MongoDB**: Local MongoDB server or MongoDB Atlas URI

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/AARVAK-VSET/launchpad-node.git
cd launchpad-node

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and supply your MONGODB_URI and SESSION_SECRET

# 4. Compile SCSS and start application
npm start
```

Visit [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Project Structure

```
launchpad-node/
├── config/             # Passport strategies and OAuth configuration
├── controllers/        # Express route controllers (auth, user, api, home)
├── models/             # Mongoose schemas and models (User, etc.)
├── public/             # Static assets (compiled CSS, JS libraries, icons)
├── views/              # Pug templates and partials
├── app.js              # Application entrypoint & middleware pipeline
├── package.json
└── README.md
```

---

## 🧪 Testing

```bash
# Run unit & integration test suites
npm test

# Run E2E tests
npm run test:e2e-nokey
```

---

## 🤝 Contributing to Patch Wars 2026

We welcome contributions from all **Patch Wars (TSJ 2026)** participants!

1. Fork this repository: `https://github.com/AARVAK-VSET/launchpad-node`
2. Claim an open issue by commenting `"Claiming this issue"` on the issue thread.
3. Create your feature branch: `git checkout -b fix/issue-<number>`
4. Implement your solution and verify tests: `npm test`
5. Submit a pull request referencing your issue: `Fixes #12`

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.  
Maintained by **[AARVAK-VSET](https://github.com/AARVAK-VSET)**.
