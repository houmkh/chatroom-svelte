<script>
    import { onMount } from "svelte";
    import { push, replace } from "svelte-spa-router";

    import Button from "@smui/button";
    import IconButton from "@smui/icon-button";
    import Snackbar, { Label, Actions } from "@smui/snackbar";
    import "boxicons";
    export let params = {};

    let files;
    let uid = params.uid;
    let username = params.username;
    let focused = false;
    /**
     * 以表单形式发送文件
     */
    let snackbarWarning;
    function upload() {
        if (files == undefined) {
            // alert("请选择文件");
            snackbarWarning.open();
            return;
        }
        let url = "/api/user/upload_file";
        let file = new FormData();
        file.append("uid", uid);
        file.append("file", files[0]);
        fetch(url, {
            method: "POST",
            body: file,
        });
    }

    let filelist = [];
    onMount(() => {
        showFiles();
    });
    /**
     * 读取用户的文件列表
     */
    function showFiles() {
        let url = "/api/user/show_files";
        fetch(url, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                uid: uid,
            }),
        })
            .then((v) => {
                return v.json();
            })
            .then((v) => {
                if (v.serve_status == 200) {
                    filelist.push(...v.data);
                    filelist = filelist;
                    // console.log(filelist);
                }
            });
    }
    /**
     * 实现文件下载
     * @param fid 文件的id
     * @param file_name 用户上传时的文件名
     */
    function downLoad(fid, file_name) {
        let url = "/api/user/download_file";
        fetch(url, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify({
                fid: fid,
            }),
        })
            .then((v) => {
                return v.blob();
            })
            .then((v) => {
                //下载文件
                let blobUrl = window.URL.createObjectURL(v);
                let a = document.createElement("a");
                a.style.display = "none";
                a.download = file_name;
                a.href = blobUrl;
                a.click();
                document.body.removeChild(a);
            });
    }

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
    let active = "File";
    $: if (active == "File") {
        switchToFile();
    } else if (active == "ChatRoom") {
        switchToChat();
    }
    function quit() {
        let url = "/";
        replace(url);
    }
</script>

<!-- <svelte:head>
    <link
        href="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"
        rel="stylesheet"
    />
</svelte:head> -->

<div class="file_management_page">
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
    <!-- <TabBar tabs={["ChatRoom", "File"]} let:tab bind:active>
        <Tab {tab} minWidth>
            <Label>{tab}</Label>
        </Tab>
    </TabBar> -->
    <div class="right">
        <form>
            <label for="file">
                <input type="file" name="file" id="file" bind:files />
            </label>

            <Button on:click={upload} variant="raised" type="submit">
                <Label>上传文件</Label>
            </Button>
        </form>
        <Snackbar bind:this={snackbarWarning} class="demo-warning">
            <Label>请选择文件</Label>
            <Actions>
                <IconButton class="material-icons" title="Dismiss"
                    ><box-icon name="x" /></IconButton
                >
            </Actions>
        </Snackbar>
        <div class="file_list">
            {#each filelist as file}
                <div>
                    <button
                        class="download_button"
                        on:click={() => downLoad(file.fid, file.file_name)}
                        >{file.file_name}</button
                    >
                </div>
            {/each}
        </div>
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
    .download_button {
        background-color: white;
        border: 0px;
        height: 30px;
    }
    .download_button:hover {
        color: rgb(1, 122, 255);
    }
    .file_management_page {
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
        grid-template-columns: 1fr 10fr;
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        box-shadow: 10px 10px 5px 1px rgba(0, 0, 255, 0.2);
        overflow: hidden;
    }
    .left-bar {
        display: flex;
        flex-flow: column;
        border-right: 1px solid lightgray;
        border-bottom: 1px solid lightgray;
        height: auto;
        width: 40px;
        background-color: #f8f4fd;
        align-items: center;
    }
    box-icon {
        cursor: pointer;
        height: 50px;
        width: 30px;
    }

    .right {
        display: flex;
        flex-flow: column;
        align-items: center;
        overflow: scroll;
    }

    #file {
        height: 35px;
    }
    form {
        margin-top: 30px;
    }
    .hide-file-ui :global(input[type="file"]::file-selector-button) {
        display: none;
    }

    .hide-file-ui
        :global(:not(.mdc-text-field--label-floating) input[type="file"]) {
        color: transparent;
    }
</style>
