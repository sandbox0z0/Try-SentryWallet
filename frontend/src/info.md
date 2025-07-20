# `frontend/src` Directory Documentation

This directory serves as the root for the entire React frontend application. It contains the core application logic, main entry points, and top-level styling.

## Folder Purpose

The `src` directory is where all the source code for the SentryWallet frontend resides. It's organized into subdirectories for better modularity and maintainability, separating concerns like UI components, utility functions, and smart contract artifacts.

## File-by-File Breakdown

### `App.css`
*   **Primary Responsibility:** Defines global and application-wide CSS styles. It includes custom utility classes and base styles that are applied throughout the application.
*   **Key Exports:** None (CSS file).
*   **Interactions:** Imported by `App.js` to apply styles to the main application structure.

### `App.js`
*   **Primary Responsibility:** The main entry point and routing configuration for the SentryWallet application. It sets up the React Router to navigate between different pages (Home, Login, Dashboard).
*   **Key Exports:** `App` (React Component).
*   **Props/State:** Manages no internal state or props directly, acting as a container for routing.
*   **Interactions:** Imports `HomePage`, `LoginPage`, and `Dashboard` components and uses `react-router-dom` for navigation.

### `index.css`
*   **Primary Responsibility:** Contains foundational CSS styles, including Tailwind CSS imports and any base styles for HTML elements. It's typically where global typography and color palettes are defined.
*   **Key Exports:** None (CSS file).
*   **Interactions:** Imported by `index.js` to apply global styles to the entire application.

### `index.js`
*   **Primary Responsibility:** The JavaScript entry point for the React application. It renders the main `App` component into the DOM.
*   **Key Exports:** None (main application bootstrap).
*   **Props/State:** Manages no internal state or props.
*   **Interactions:** Imports `React`, `ReactDOM`, `App`, and `index.css` to initialize and render the application.

## Interactions & Dependencies

The `frontend/src` directory orchestrates the entire user interface. `index.js` is the bootstrap, rendering `App.js`. `App.js` then handles routing to different top-level components like `HomePage`, `LoginPage`, and `Dashboard`. Global styling is managed through `App.css` and `index.css`. The subdirectories (`components`, `contracts`, `utils`) provide modular pieces that are imported and utilized by these core files to build the complete application.
