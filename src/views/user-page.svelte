<script>
    import UserList from "../components/user-list.svelte";
    import ChatRoom from "../components/chat-room.svelte";
    import { replace } from "svelte-spa-router";
    import { RadioButtonGroup } from "carbon-components-svelte";

    export let params = {};

    let wsConn;
    function wsInit() {
        wsConn = new WebSocket("ws://localhost:8082/chat");
        try {
            wsConn.onopen = function () {
                // alert("成功连接至服务器");
                sendUserInfo();
            };
            wsConn.onclose = function () {
                if (wsConn) {
                    wsConn.close();
                    wsConn = null;
                }
                alert("websocket连接已断开");
                replace("/");
            };
            wsConn.onmessage = function (ret) {
                console.log(ret.data);
                // handleMessage(ret.data);
                let data = JSON.parse(ret.data);
                if (data.type === "msg") {
                    //消息
                    messages.push(data.data);
                    console.log(messages);
                    let msgnode = document.getElementById("msg");
                    let node = document.createElement("div");
                    node.innerHTML = `<div>From: ${data.data.from_name} To: ${data.data.to_name}</div>
                    <div>${data.data.context}</div>`;
                    node.className = "msgnode";
                    msgnode.appendChild(node);
                } else if (data.type === "room_info") {
                    //房间信息
                    user_num = data.data.online_num;
                    user_list = data.data.online_user_list;
                    let userlist_node = document.getElementById("userlist");
                    for (var i = 0; i < user_num; i++) {
                        let node = document.createElement("div");
                        node.innerHTML = ` <label
                        ><input
                            type="radio"
                            bind:group=${choose_user}
                            value=${user_list[i].uid}
                        />
                        ${user_list[i].username}
                         </label>`;
                        node.className = "userlist_node";
                        userlist_node.appendChild(node);
                    }
                }
            };
            wsConn.onerror = function () {
                if (wsConn) {
                    wsConn.close();
                    wsConn = null;
                }
                alert("websocket出错断开");
            };
        } catch (e) {
            alert(e.message);
        }
    }
    wsInit();
    let uid = params.uid,
        username = params.username;
    let choose_user = uid;

    function sendUserInfo() {
        let userinfo = {
            type: "login",
            data: {
                uid: uid,
                username: username,
            },
        };
        wsConn.send(JSON.stringify(userinfo));
    }
    $: num = user_num;
    let user_num = 1,
        user_list = [];
    let messages = [];

    // async function handleMessage(d) {
    //     let data = JSON.parse(d);
    //     if (data.type === "msg") {
    //         //消息
    //         messages.push(data.data);
    //         console.log(messages);
    //         // let msgnode = document.getElementById("msg");
    //         // let node = document.createElement("div");
    //         // node.innerHTML = `<div>From: ${data.data.from} To: ${data.data.to}</div>
    //         // <div>${data.data.context}</div>`;
    //         // msgnode.appendChild(node);
    //     } else if (data.type === "room_info") {
    //         //房间信息
    //         user_num = await data.data.roomInfo.online_num;
    //         user_list = await data.data.roomInfo.online_user_list;
    //     }
    // }

    let newmessage = { context: "", to: null };
    $: newmessage.to = choose_user;
    function sendMessage() {
        let context = newmessage.context.trim();
        if (context.length === 0) {
            alert("请输入内容");
            return;
        }
        if (newmessage.to == uid) {
            alert("不能发消息给自己");
            return;
        }
        let msg = {
            type: "msg",
            data: {
                from: uid,
                to: newmessage.to,
                context: newmessage.context,
            },
        };
        console.log(msg);
        wsConn.send(JSON.stringify(msg));
        newmessage.context = "";
    }
</script>

<div class="page">
    <h2>welcome {username}</h2>
    <div>聊天室有 {num} 人</div>
    {#each user_list as user}
        <div>
            <label
                ><input
                    type="radio"
                    bind:group={choose_user}
                    value={user.uid}
                />
                {user.username}
            </label>
        </div>
    {/each}
    <!-- <div id="userlist" /> -->
    <div id="msg" />
    <textarea cols="40" rows="6" bind:value={newmessage.context} />
    <button on:click={sendMessage}>发送消息</button>
</div>

<style>
    .page {
        display: flex;
        flex-flow: column;
        width: 800px;
        box-sizing: border-box;
        border: 1px solid gainsboro;
        border-radius: 5px;
        margin: 30px auto auto auto;
        justify-content: center;
        align-items: center;
        height: 600px;
    }
    #msg {
        border: 1px solid gray;
        margin: 10px;
        width: 200px;
    }
    .msgnode {
        border-bottom: 1px solid grey;
    }
    button {
        width: 100px;
        height: 50px;
        margin: 10px;
        border-radius: 5px;
    }
</style>
