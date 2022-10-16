<script>
    import { Grid, Row, Column } from "carbon-components-svelte";
    // 要从后端获取用户信息
    /*
    TODO
    1.获取当前用户的好友列表，每个好友都要可以选中
    2.获取当前用户与选中好友的聊天记录 分页加载 一次15条

    */
    let users = [{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }];
</script>

<div class="user-list">
    <Grid padding>
        {#each users as user}
            <Row padding><Column>{user.name}</Column></Row>
        {/each}
    </Grid>
</div>

<style>
    .user-list {
        float: left;
        border: 1px solid gainsboro;
    }
</style>
