<script>
    import { onMount } from "svelte";
    import { push, replace } from "svelte-spa-router";

    export let params = {};

    let files;
    let uid = params.uid;
    let username = params.username;
    /**
     * 以表单形式发送文件
     */
    function upload() {
        if (files == undefined) {
            alert("请选择文件");
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
                filelist.push(...v);
                filelist = filelist;
                console.log(filelist);
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
</script>

<div class="file_management_page">
    <div class="bar">
        <button on:click={switchToChat} id="chat_button">chatroom</button>
        <button on:click={switchToFile} id="file_button">file</button>
    </div>

    <form>
        <label for="file">
            <input type="file" name="file" id="file" bind:files />
        </label>
        <button type="submit" on:click={upload} id="upload_button"
            >上传文件</button
        >
    </form>
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

<style>
    .download_button {
        background-color: white;
        border: 0px;
        height: 30px;
    }
    .download_button:hover {
        color: rgb(1, 122, 255);
    }
    .file_management_page {
        display: flex;
        flex-flow: column;
        align-items: center;
        width: 700px;
        margin: auto;
        margin-top: 0px;
        background-color: rgb(254, 254, 254);
        /* border: 1px solid lightgray; */
    }
    .bar {
        width: 700px;
        display: flex;
        flex-flow: row;
    }
    #chat_button,
    #file_button {
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

    #upload_button {
        border: 0px;
        width: 100px;
        height: 35px;
        background-color: rgb(1, 122, 255);
        color: white;
        border-radius: 5px;
    }
    #upload_button:hover {
        background-color: rgba(1, 124, 255, 0.718);
    }
    #file {
        height: 35px;
    }
    form {
        margin-top: 30px;
    }
</style>
