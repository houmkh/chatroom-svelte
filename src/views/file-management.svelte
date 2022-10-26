<script>
    import { onMount } from "svelte";

    export let params = {};

    let files;
    let uid = params.uid;
    let username = params.username;
    function upload() {
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
                let blobUrl = window.URL.createObjectURL(v);
                let a = document.createElement("a");
                a.style.display = "none";
                a.download = file_name;
                a.href = blobUrl;
                a.click();
                document.body.removeChild(a);
            });
    }
</script>

<form>
    <label for="file">
        <input type="file" name="file" id="file" bind:files />
    </label>
    <button type="submit" on:click={upload}>上传文件</button>
</form>
{#each filelist as file}
    <div>
        <button
            class="download_button"
            on:click={() => downLoad(file.fid, file.file_name)}
            >{file.file_name}</button
        >
    </div>
{/each}

<style>
    .download_button {
    }
</style>
