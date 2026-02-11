# MiniERP - Power Apps Code App

MiniERP is a specialized "Code App" built for the Power Platform using React, TypeScript, and Vite. It demonstrates how to build modular business applications that run natively within Power Apps while leveraging a modern web development stack.

## 🚀 Overview

This project uses the `@microsoft/power-apps-vite` plugin to bridge React development with the Power Platform. It includes features for employee profile management, salary calculations, and budget visualization.

## 🛠️ Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Language:** TypeScript
- **Styling:** Bootstrap 5 & React-Bootstrap
- **Platforms:** Power Platform (Power Apps)

## 🏗️ Development Setup

### Prerequisites

1.  **Node.js:** Ensure you have the latest LTS version installed.
2.  **Power Platform CLI (pac):** Required for deployment.
    ```bash
    pac install
    ```
3.  **Authentication:** Authenticate with your Power Platform environment.
    ```bash
    pac auth create --url https://<your-org>.crm.dynamics.com
    ```

### Installation

```bash
npm install
```

### Local Development

Run the Vite development server:
```bash
npm run dev
```

To run with the Power Apps connection bridge:
```bash
pac code run
```

## 🚢 Deployment

The project includes a custom deployment script that increments the version, builds the project, and pushes it to the Power Platform.

```bash
npm run deploy
```

This command executes:
1.  **Version Increment:** Updates `package.json` version.
2.  **Build:** Runs `tsc` and `vite build`.
3.  **Push:** Executes `pac code push` using the configuration in `power.config.json`.

## 📂 Project Structure

- `src/components/`: Reusable React components (Budget Gauge, Salary Calculator, etc.)
- `src/hooks/`: Custom React hooks for data management.
- `src/Services/`: Data services for Power Apps integration (generated via `pac code add-data-source`).
- `src/Models/`: Data models for the application.
- `scripts/deploy.js`: Automation for build and deployment.
- `power.config.json`: Power Apps environment and app configuration.

## 📄 License

MIT
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
