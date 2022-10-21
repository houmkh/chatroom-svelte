import login from './views/login.svelte'
import chat from './views/user-page.svelte'
const routes = {
  '/': login,
  '/chat/:uid/:username':chat,
}

export default routes;