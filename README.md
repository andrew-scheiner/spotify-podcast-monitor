# Google Apps Script Project Template

A reusable starter for Google Apps Script projects using CLASP and VS Code.

## Setup

1. Copy or clone this template into a separate folder for your actual project, for example:
   ```sh
   mkdir C:/Users/andre/Dev/MyProject
   cd C:/Users/andre/Dev/MyProject
   ```
   Do not use the template folder itself as your working project folder.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Install recommended VS Code extensions if prompted.
4. Authenticate CLASP:
   ```sh
   npx clasp login
   ```
5. Create or clone your project:
   - New project:
     ```sh
     npx clasp create --title "My Project" --rootDir .
     ```
   - Clone existing script:
     ```sh
     npx clasp clone <SCRIPT_ID> .
     ```
6. Update `.clasp.json` with the correct `scriptId` if needed.

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
- When using CLASP, keep the Apps Script manifest at the project root and avoid pushing dependency folders such as `node_modules/`.
