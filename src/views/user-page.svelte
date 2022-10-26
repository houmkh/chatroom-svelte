<script>
    import { onMount } from "svelte";
    import { push, replace } from "svelte-spa-router";
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
                // alert("websocket连接已断开");
                replace("/");
            };
            wsConn.onmessage = function (ret) {
                console.log(ret.data);
                let data = JSON.parse(ret.data);
                let msgnode = document.getElementById("msg");
                if (data.type === "msg") {
                    //消息
                    messages.push(data.data);
                    console.log(messages);
                    let node = document.createElement("div");
                    node.innerHTML = `<div>From: ${data.data.from_name} To: ${data.data.to_name}</div>
                    <div>${data.data.context}</div>`;
                    node.className = "msgnode";
                    msgnode.append(node);
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
                } else if (data.type === "file") {
                    let node = document.createElement("div");
                    node.innerHTML = `<div>From: ${data.data.from_name} To: ${data.data.to_name}</div>
                    <img src="${data.data.file_context}"/>`;
                    node.className = "msgnode";
                    msgnode.append(node);
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
    onMount(() => {
        wsInit();
    });

    let uid = params.uid,
        username = params.username;
    let choose_user = uid;
    function switchToFile() {
        let url = "/file_management/" + uid + "/" + username;
        push(url);
    }

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

    /*
        file{
            from:
            to:
            from_name:
            to_name:
            file_name:
            file_type:
            file_content
        }
*/
    // let files;
    // $: if (files) {
    //     console.log(files[0]);
    // }
    // function sendFile() {
    //     let reader = new FileReader();
    //     reader.readAsDataURL(files[0]);
    //     reader.addEventListener("loadend", (event) => {
    //         let msg = {
    //             type: "file",
    //             data: {
    //                 from: uid,
    //                 to: choose_user,
    //                 file_name: files[0].name,
    //                 file_type: files[0].type,
    //                 file_context: event.target.result,
    //             },
    //         };

    //         // wsConn.send(JSON.stringify(msg));
    //         wsConn.send(JSON.stringify(msg));
    //         console.log(JSON.stringify(msg));
    //     });
    // }
</script>

<div class="bar">
    <div>chat</div>
    <button on:click={switchToFile}>file</button>
</div>
<div class="page">
    <h2>welcome {username}</h2>
    <div>聊天室有 {num} 人</div>
    <div class="userlist">
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
    </div>
    <div class="chat_area">
        <div>
            <div id="msg" />
            <textarea cols="50" rows="6" bind:value={newmessage.context} />
        </div>
        <button on:click={sendMessage}>发送消息</button>
        <!-- <div>
            <input type="file" id="input_file" accept="image/jpeg" bind:files />
            <button on:click={sendFile}>发送文件</button>
        </div> -->

        <!-- <button type="submit" /> -->
    </div>
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
        /* justify-content: center; */
        /* align-items: center; */
        height: 600px;
    }
    .userlist {
        float: left;
    }
    #msg {
        border: 1px solid gray;
        margin: 10px;
        width: 200px;
    }

    button {
        width: 80px;
        height: 35px;
        /* margin: 10px; */
        border-radius: 5px;
        border: 1px solid black;
    }
    .chat_area {
        /* float: right; */
        box-sizing: border-box;
    }
</style>
