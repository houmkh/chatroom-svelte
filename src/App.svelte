<script>
  import Router from "svelte-spa-router";
  // import routes from "./routes";
 import routes from "./routes/index";
</script>
<svelte:head>
  <link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
</svelte:head>
<main>
  <!-- <Login/> -->
  <Router {routes} />
</main>
