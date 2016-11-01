import AuthStore from '../stores/AuthStore';

export default {
  requireAuth(nextState, replace) {
    if (!AuthStore.isUser()) {
      replace({
        pathname: '/notAuthorized'
      });
    }
  }
}
