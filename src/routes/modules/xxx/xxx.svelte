<script>
    import Button, { Label } from "@smui/button";
</script>

<svelte:head>
    <link rel="stylesheet" href="src\theme\dist\smui.css" />
</svelte:head>
<Button variant="raised">
    <Label>xxx</Label>
</Button>
<div class="all">
    <div class="d d1">1</div>
    <div class="d d2">2</div>
    <div class="d d3">3</div>
    <div class="d d4">4</div>
    <div class="d d5">5</div>
    <div class="d d6">6</div>
</div>

<style>
    .all {
        display: flex;
        flex-wrap: wrap;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr;
    }
    .d {
        display: flex;
        border: 1px solid cadetblue;
        width: 10em;
        height: 10em;
        align-items: center;
        justify-content: center;
    }

</style>
