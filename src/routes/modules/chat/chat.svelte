<script>
    import { onMount } from "svelte";
    import { push, replace } from "svelte-spa-router";
    import Tab,{Label} from "@smui/tab";
    import TabBar from "@smui/tab-bar";
    export let params = {};
    let messages = [];

    let wsConn;
    /**
     * 创建websocket连接
     */

    function wsInit() {
        wsConn = new WebSocket("ws://localhost:8082/chat");
        try {
            wsConn.onopen = function () {
                // alert("成功连接至服务器");
                sendUserInfo();
            };
            wsConn.onclose = function () {
                wsConn.close();
                wsConn = null;

                // alert("websocket连接已断开");
                // replace("/");
            };
            wsConn.onmessage = function (ret) {
                // console.log(ret.data);
                let data = JSON.parse(ret.data);
                let msgnode = document.getElementById("msg");
                if (data.type === "msg") {
                    //消息
                    messages.push(data.data);
                    messages = messages;
                    console.log(messages);
                    let node = document.createElement("div");
                    node.innerHTML = `<div><div>From: ${data.data.from_name} To: ${data.data.to_name}</div>
                    <div>${data.data.context}</div></div>`;
                    node.className = "msgnode";
                    msgnode.append(node);
                } else if (data.type === "room_info") {
                    //房间信息
                    user_num = data.data.online_num;
                    user_list = data.data.online_user_list;
                }
            };
            wsConn.onerror = function () {
                wsConn.close();
                wsConn = null;

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

    /**
     * 切换页面
     */
    function switchToFile() {
        let url = "/file_management/" + uid + "/" + username;
        replace(url);
    }
    function switchToChat() {
        let url = "/chat/" + uid + "/" + username;
        replace(url);
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
    let active = "ChatRoom";
    $: if (active == "File") {
        switchToFile();
    } else if (active == "ChatRoom") {
        switchToChat();
    }


    $: num = user_num;
    let user_num = 1,
        user_list = [];

    let newmessage = { context: "", to: null };
    $: newmessage.to = choose_user;

    /**
     * 处理消息发送
     */
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
        // console.log(msg);
        wsConn.send(JSON.stringify(msg));
        newmessage.context = "";
    }
</script>

<div class="page">
    <div class="left">
        <!-- <div class="bar">
            <button on:click={switchToChat} id="chat_button">chatroom</button>
            <button on:click={switchToFile} id="file_button">file</button>
        </div> -->
        <TabBar tabs={["ChatRoom", "File"]} let:tab bind:active>
            <Tab {tab} minWidth>
                <Label>{tab}</Label>
            </Tab>
        </TabBar>
        <div class="roominfo">
            <h2>welcome {username}</h2>
            <div>聊天室有 {num} 人</div>
        </div>
        <div class="userlist">
            {#each user_list as user}
                <div>
                    <label
                        ><input
                            type="radio"
                            bind:group={choose_user}
                            value={user.uid}
                            class="user_radio"
                        />
                        {user.username}
                    </label>
                </div>
            {/each}
        </div>
    </div>

    <div class="chat_area">
        <div>
            <div id="msg">
                <!-- {#each messages as message}
                    <div>From: {message.from_name} To: {message.to_name}</div>
                    <div>{message.context}</div>
                {/each} -->
            </div>
            <textarea cols="60" rows="6" bind:value={newmessage.context} />
        </div>
        <button on:click={sendMessage} id="send_button">发送消息</button>
    </div>
</div>

<style>
    .page {
        display: flex;
        flex-flow: column;
        width: 700px;
        box-sizing: border-box;
        border: 1px solid gainsboro;
        border-radius: 5px;
        margin: 30px auto auto auto;
        height: 600px;
        flex-wrap: wrap;
        align-items: baseline;
    }
    .left {
        height: 600px;
        border-right: 1px solid lightgray;
    }
    #msg {
        border: 1px solid gray;
        margin: 10px;
        width: 200px;
    }
    .chat_area {
        box-sizing: border-box;
    }
    .user_radio {
        border-bottom: 1px solid lightgray;
    }
    #chat_button,
    #file_button,
    #send_button {
        border: 0px;
        border-bottom: 1px solid lightgray;
        width: 100px;
        height: 35px;
        font-size: 14px;
        background-color: white;
    }
    #chat_button:hover,
    #file_button:hover {
        background-color: rgb(1, 122, 255);
        color: white;
    }
    #send_button {
        border: 0px;
        background-color: rgb(1, 122, 255);
        color: white;
    }
    #msg {
        margin-top: 10px;
        height: 450px;
        margin: 0px;
        width: 450px;
        border: 0px;
    }
</style>
