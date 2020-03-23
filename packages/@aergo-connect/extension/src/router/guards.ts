import { NavigationGuard, Route } from 'vue-router';
import store from '../store';

/**
 * Load persisted route on initial load
 * or whenever selecting an account during permission request (TODO)
 */
export const loadPersistedRoute: NavigationGuard = (to, from, next) => {
  const isStartTransition = from.fullPath === '/' && from.name === null && to.name === 'accounts-list';
  if (isStartTransition || to.name == 'account-detail') { // TODO
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
  if (!(to.meta && to.meta.noTracking === true)) {
    store.commit('ui/setCurrentRoute', to);
  }
  return next();
}

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const updateTitle = (to: Route): void => {
  setTimeout(() => {
    document.title = to.meta && to.meta.title || capitalizeFirstLetter(to.name || '') + ' - Aergo Connect';
  });
}
