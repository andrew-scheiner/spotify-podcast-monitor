# Google Apps Script Project Template

A reusable starter for Google Apps Script projects using CLASP and VS Code.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Install recommended VS Code extensions if prompted.
3. Authenticate CLASP:
   ```sh
   npx clasp login
   ```
4. Create or clone your project:
   - New project:
     ```sh
     npx clasp create --title "My Project" --rootDir .
     ```
   - Clone existing script:
     ```sh
     npx clasp clone <SCRIPT_ID> .
     ```
5. Update `.clasp.json` with the correct `scriptId` if needed.

## Development

- Push local changes:
  ```sh
  npx clasp push
  ```
- Pull remote changes:
  ```sh
  npx clasp pull
  ```
- Run lint:
  ```sh
  npm run lint
  ```
- Format files:
  ```sh
  npm run format
  ```

## Notes

- Use `*.gs` as JavaScript files in VS Code.
- Keep `appsscript.json` scoped to the project; update scopes only when necessary.
- `node_modules/` and `.vscode/` are ignored in `.claspignore`.
