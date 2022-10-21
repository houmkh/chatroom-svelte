<script>
  import Login from "./views/login.svelte";
  import Router from "svelte-spa-router";
  import routes from "./routes";
 
</script>

<main>
  <!-- <Login/> -->
  <Router {routes} />
</main>
