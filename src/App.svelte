<script>
  import Login from "./views/login.svelte";
  import Router from "svelte-spa-router";
  // import routes from "./routes";
 import routes from "./routes/index";
</script>

<main>
  <!-- <Login/> -->
  <Router {routes} />
</main>
