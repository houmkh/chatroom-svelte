<script>
    import { identity, validate_each_keys } from "svelte/internal";

    // 获取所有用户信息
    let user_list = [];
    function show_all_users_info() {
        let url = "/api/admin/show_users";

        fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        })
            .then((value) => {
                return value.json();
            })
            .then((value) => {
                user_list = value;
            });
    }
    show_all_users_info();

    function delete_user(id) {
        let url = "/api/admin/delete_user";
        fetch(url, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                uid: id,
            }),
        })
            .then((value) => value.json())
            .then((value) => {
                console.log(value);
                show_all_users_info();
            });
    }
    let username = "";

    function change_user_info(id) {
        if (username == "") {
            alert("请修改用户姓名");
            return;
        }
        let url = "/api/admin/change_user_info";
        fetch(url, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                uid: id,
                new_username: username,
            }),
        })
            .then((value) => value.json())
            .then((value) => {
                console.log(value);
            });
    }
</script>

<div class="page">
    <table width="600" >
        <tr>
            <th>用户编号</th>
            <th>用户名</th>
            <th>是否在线</th>
            <th>操作</th>
        </tr>
        {#each user_list as user}
            <tr>
                <td>
                    <!-- <input
                        type="radio"
                        bind:group={uid}
                        value={user.uid}
                    />{user.uid}</td
                > -->
                    {user.uid}
                </td><td>
                    <input
                        type="text"
                        bind:value={username}
                        placeholder={user.username}
                        class="input_name"
                        style="border: 0px;"
                    /></td
                >
                <td>是</td>
                <td>
                    <button on:click={() => delete_user(user.uid)}>删除</button>
                    <button on:click={() => change_user_info(user.uid)}
                        >修改</button
                    >
                </td>
            </tr>
        {/each}
    </table>
</div>

<style lang="css">
    .page {
        display: flex;
        flex-flow: column;
        align-items: center;
        margin: 20px auto;
    }

    table,
    th,
    td {
        text-align: center;
        border: 1px solid grey;
        border-collapse:collapse;
        
    }
    th{
        background-color:rgba(240, 234, 125, 0.447);
    }
    button {
        width: 50px;
        height: 25px;
        border-radius: 5px;
        margin: 5px 5px;
        border: 1px solid black;
        background-color: rgba(245, 242, 213, 0.922);
    }
</style>
