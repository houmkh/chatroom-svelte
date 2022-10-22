import login from './views/login.svelte'
import chat from './views/user-page.svelte'
import user_management_center from './views/user-manager.svelte';
const routes = {
  '/': login,
  '/chat/:uid/:username': chat,
  '/user_management_center': user_management_center,
}

export default routes;