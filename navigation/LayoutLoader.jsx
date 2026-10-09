// src/ScreenLoader.js
import {CUSTOM_LAYOUT_ACTIVE, ACTIVE_LAYOUT} from '../app.config';

const getScreenPath = screenName => {
  const customLayout = `../screens/layout/${ACTIVE_LAYOUT}/${screenName}.js`;
  const defaultScreenPath = `../screens/${screenName}.js`;

  try {
    // Attempt to require the client-specific screen first.
    // This will throw an error if the file doesn't exist.
    require(customLayout);
    return customLayout;
  } catch (e) {
    // If the client-specific screen doesn't exist, use the default.
    return defaultScreenPath;
  }
};

export const loadScreenComponent = screenName => {
  const screenPath = getScreenPath(screenName);
  // Using require here for simplicity, but consider dynamic import() for async loading
  return require(screenPath).default;
};

// Or, if you prefer a more explicit mapping:
// export const getComponentForClient = (componentName) => {
//   let component;
//   try {
//     component = require(`./client_configs/${ACTIVE_CLIENT}/${componentName}`).default;
//   } catch (error) {
//     component = require(`./screens/${componentName}`).default;
//   }
//   return component;
// };
