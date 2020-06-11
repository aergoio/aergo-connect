import { NavigationGuard, Route } from 'vue-router';
import store from '../store';
import { capitalizeFirstLetter } from '../utils/strings';

/**
 * If we're coming from the lockscreen, check that app was actually unlocked.
 * Otherwise you can e.g. just 'go back' to show a previous screen (privacy issue).
 */
export const allowedToExitLockscreen: NavigationGuard = (to, from, next) => {
  if (from.name === 'lockscreen') {
    const exclude = ['', '/', '/welcome'];
    if (!store.state.ui.unlocked && exclude.indexOf(to.fullPath) === -1) {
      return next({ name: 'lockscreen' });
    }
  }
  return next();
}

/**
 * Load persisted route on initial load
 * or whenever selecting an account during permission request
 */
export const loadPersistedRoute: NavigationGuard = (to, from, next) => {
  const isStartTransition = from.fullPath === '/' && from.name === null && to.name === 'accounts-list';
  if (isStartTransition) {
      const persistedPath = store.state.ui.route.currentPath;
      const exclude = ['', '/', '/welcome', to.fullPath];
      if (persistedPath && exclude.indexOf(persistedPath) === -1) {
        return next(persistedPath);
      }
  }
  return next();
}

/**
 * Persist next route to store
 */
export const persistRoute: NavigationGuard = (to, _from, next) => {
  if (!(to.meta && to.meta.noTracking === true || to.fullPath.match(/request/))) {
    store.commit('ui/setCurrentRoute', to);
  }
  return next();
}

/**
 * afterEach hook to update document title
 */
export const updateTitle = (to: Route): void => {
  setTimeout(() => {
    document.title = to.meta && to.meta.title || capitalizeFirstLetter(to.name || '') + ' - Aergo Connect';
  });
}

/**
 * This guard is added if we are in request mode.
 * It overrides all other guards and redirects to 'request-select' if not in a request route.
 */
export const enforceRequest: NavigationGuard = (to, _from, next) => {
  if (!to.fullPath.match(/request/) && to.fullPath !== '/locked') {
    return next({ name: 'request-select-account' });
  }
  return next();
}