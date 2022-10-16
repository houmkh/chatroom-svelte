<script>
    import UserList from "../components/user-list.svelte";
    import ChatRoom from "../components/chat-room.svelte";
</script>

<div class="page">
    <UserList />
    <ChatRoom />
</div>

<style>
    .page {
        display: flex;
        flex-flow: row;
        width: 800px;
        box-sizing: border-box;
        border: 1px solid gainsboro;
        border-radius: 5px;
        margin: auto;
        justify-content: center;
    }
</style>
