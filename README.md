# Playlist App Automated UI Tests

This project contains automated UI tests for the Playlist App using Playwright and JavaScript.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd playlist-app-tests
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright Browsers**:
   ```bash
   npx playwright install
   ```

4. **Configure Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the base URL:
     ```plaintext
     APP_URL=https://vite-react-alpha-lemon.vercel.app/
     ```

5. **Lint and Format Code**:
   ```bash
   npm run lint
   npm run format
   ```

## Running Tests

- **Run Tests in Headless Mode**:
  ```bash
  npm run test
  ```
- **Run Tests with Visible Browser**:
  ```bash
  npx playwright test --headed
  ```
- **Run Specific Test**:
  ```bash
  npx playwright test tests/playlist.spec.js
  ```

## Project Structure

- `tests/`: Test scripts for the Playlist App.
- `utils/`: Helper functions (e.g., duration conversion).
- `.env`: Environment variables (base URL).
- `playwright.config.js`: Playwright configuration.
- `.eslintrc.json`, `.prettierrc`: Linting and formatting rules.

## Test Cases

1. **Search Functionality**: Verifies that the search input filters tracks by name.
2. **Add Track**: Ensures a track is added to the playlist using the "+" button.
3. **Total Duration**: Validates the playlist’s total duration in seconds.

## Troubleshooting

- Ensure `.env` contains the correct `APP_URL`.
- If tests fail, check browser compatibility or network connectivity.
- Run `npx playwright install` if browser issues occur.
