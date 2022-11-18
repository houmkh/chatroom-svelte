<script>
    import { onMount } from "svelte";
    import { push, replace } from "svelte-spa-router";
    import Tab, { Label } from "@smui/tab";
    import List, { Group, Item, Subheader, Text } from "@smui/list";
    import Button from "@smui/button";
    import IconButton from "@smui/icon-button";
    import Snackbar, { Actions } from "@smui/snackbar";

    import "boxicons";
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
                // let msgnode = document.getElementById("msg");
                if (data.type === "msg") {
                    messages = [
                        ...messages,
                        {
                            from_name: data.data.from_name,
                            to_name: data.data.to_name,
                            context: data.data.context,
                        },
                    ];
                    //消息
                    // messages.push(data.data);

                    // messages = messages;
                    // console.log(messages);
                    // let node = document.createElement("div");
                    // node.innerHTML = `<div><div>From: ${data.data.from_name} To: ${data.data.to_name}</div>
                    // <div>${data.data.context}</div></div>`;
                    // node.className = "msgnode";
                    // msgnode.append(node);
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
    console.log(messages);
    let uid = params.uid,
        username = params.username;
    let choose_user = uid;

    /**
     * 切换页面
     */
    function switchToFile() {
        wsConn.close();
        wsConn = null;
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
    let snackbarWarning1;
    let snackbarWarning2;

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
            // alert("请输入内容");
            snackbarWarning1.open();

            return;
        }
        if (newmessage.to == uid) {
            // alert("不能发消息给自己");
            snackbarWarning2.open();

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
    function quit() {
        wsConn.close();
        wsConn = null;
        let url = "/";
        replace(url);
    }
</script>

<svelte:head>
    <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
    />
</svelte:head>

<div class="page ">
    <div class="left-bar">
        <box-icon
            class="icon_btn"
            name="chat"
            color="#6200ee"
            on:click={switchToChat}
        />

        <box-icon
            class="icon_btn"
            name="folder"
            color="#6200ee"
            on:click={switchToFile}
        />
        <box-icon
            class="icon_btn"
            name="log-out-circle"
            color="#6200ee"
            on:click={quit}
        />
    </div>
    <div class="left">
        <div class="roominfo">
            <h2>welcome {username}</h2>
            <div>聊天室有 {num} 人</div>
        </div>
        <div class="userlist">
            <Group>
                {#each user_list as user}
                    <Item on:SMUI:action={() => (choose_user = user.uid)}>
                        <Text>{user.username}</Text>
                    </Item>
                {/each}
            </Group>
        </div>
    </div>
    <Snackbar bind:this={snackbarWarning1} class="demo-warning">
        <Label>不能发送空消息</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss"
                ><box-icon name="x" /></IconButton
            >
        </Actions>
    </Snackbar>
    <Snackbar bind:this={snackbarWarning2} class="demo-warning">
        <Label>不能发消息给自己</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss"
                ><box-icon name="x" /></IconButton
            >
        </Actions>
    </Snackbar>
    <div class="right">
        <div>
            <div id="msg">
                {#each messages as message}
                    <div class="msg-box other">
                        <div class="name-box">
                            From: <a class="name-from">{message.from_name}</a>
                            To: <a class="name-to">{message.to_name}</a>
                        </div>
                        <div>{message.context}</div>
                    </div>
                {/each}
            </div>
            <textarea
                class="text_input"
                cols="68"
                rows="6"
                bind:value={newmessage.context}
            />
        </div>
        <Button
            style="position: absolute;right: 10px;"
            on:click={sendMessage}
            variant="raised"
        >
            <Label>发送消息</Label>
        </Button>
    </div>
</div>

<style>
    /* 滚动条 */
    ::-webkit-scrollbar {
        width: 7px;
        height: 1px;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 5px rgb(0 0 0 / 8%);
        background: #dbdbdb;
    }
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px rgb(145 145 145 / 20%);
        border-radius: 10px;
        background: #ffffff;
    }
    .page {
        flex-flow: column;
        width: 745px;
        box-sizing: border-box;
        border: 1px solid gainsboro;
        border-radius: 5px;
        margin: 30px auto auto auto;
        height: 600px;
        /* flex-wrap: wrap; */
        /* align-items: baseline; */
        /* align-content: flex-start; */
        display: grid;
        grid-template-columns: 0.5fr 3fr 8fr;
        grid-template-rows: 1fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        box-shadow: 10px 10px 5px 1px rgba(0, 0, 255, 0.2);
        overflow: hidden;
    }
    .roominfo {
        padding: 0 10px 0 10px;
    }
    .left-bar {
        display: flex;
        flex-flow: column;
        border-right: 1px solid #cccccc;
        height: auto;
        width: 40px;
        background-color: #f8f4fd;
        align-items: center;
    }

    .left {
        height: 600px;
        border: 0px;
        border-right: 1px solid #a6a6a6;
    }
    #msg {
        border: 1px solid gray;
        margin: 10px;
        width: 200px;
        padding-left: 20px;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        direction: ltr;
        outline: none;
        box-sizing: content-box;
        overflow: auto;
        padding-left: 50px;
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
    }

    .right {
        position: relative;
        box-sizing: border-box;
        width: auto !important;
    }
    .msg-box {
        margin: 8px 0 8px 0;
    }
    #msg {
        margin-top: 10px;
        height: 450px;
        margin: 0px;
        width: 450px;
        border: 0px;
    }

    .msg-box {
        color: #1a1a1a;
        /* width: 100px; */
        height: auto;
        font-size: 13px;
        margin-bottom: 10px;
        border: 1px solid;
        overflow: auto;
        background: lightcyan;
        border-radius: 3px;
    }
    
    .name-from {
        color: rgb(164, 107, 245) !important;
    }
    .name-to {
        color: rgb(164, 107, 245) !important;
    }
    box-icon {
        cursor: pointer;
        height: 50px;
        width: 30px;
    }
    .text_input {
        resize: none;
        /* width: 99%; */
        width: auto;
        border-bottom: 0px;
        border-left: 0px;
        border-right: 0px;
        border-top: 1px solid #a6a6a6;
    }

    .userlist {
        overflow: auto;
    }
</style>
