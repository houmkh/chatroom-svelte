import chatSvelte from "./chat.svelte";
const routes = {
    '/chat/:uid/:username': chatSvelte,

}
export default routes;