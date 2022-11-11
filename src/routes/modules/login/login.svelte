<script>
    import { params, replace } from "svelte-spa-router";
    import Button, { Label } from "@smui/button";
    import Textfield from "@smui/textfield";
    import Icon from "@smui/textfield/icon";
    import IconButton from "@smui/icon-button";
    import Snackbar, { Actions } from "@smui/snackbar";
    import HelperText from "@smui/textfield/helper-text";
    let username = "",
        password = "";

    function login() {
        let url = "/api/user/login";
        let uid, replace_url;
        if (username !== "" && password !== "") {
            fetch(url, {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
                // .then(console.log);
                .then((value) => value.json())
                .catch(console.error)
                .then((value) => {
                    if (value.serve_status == -1) {
                        alert("密码错误");
                        username = "";
                        password = "";
                        return;
                    }
                    if (value.serve_status == -300) {
                        alert("用户不存在");
                        username = "";
                        password = "";
                        return;
                    }
                    uid = value.uid;
                    if (value.privilege == 1)
                        replace_url =
                            "/file_management/" + uid + "/" + username;
                    else if (value.privilege == 2)
                        replace_url = "/user_management_center";
                    console.log(value);
                    replace(replace_url);
                })
                .catch(console.error);
        } else {
            snackbarWarning.open()
        }
    }
    function rigester() {
        let url = "/api/user/register";
        if (username !== "" && password !== "") {
            console.log(username, password);
            fetch(url, {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
                redirect: "follow",
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }).then((value) => {
                return value.json();
            });
        } else {
            // alert("请输入用户名和密码");
            snackbarWarning.open()
        }
    }
    let snackbarWarning;
</script>

<div class="page">

    <div class="login-form">
        <!-- <label
            >用户名
            <input
                placeholder="请输入用户名"
                bind:value={username}
                required
            /></label
        > -->
        <Textfield
            variant="outlined"
            bind:value={username}
            label="用户名"
            required
            style="width: 300px;height: 50px;"
        >
            <HelperText slot="helper">请输入用户名</HelperText>
        </Textfield>
        <Textfield
            variant="outlined"
            bind:value={password}
            label="密码"
            required
            style="width: 300px;height: 50px;"
        >
            <HelperText slot="helper">请输入密码</HelperText>
        </Textfield>
        <!-- <label>
            密码<input
                type="password"
                placeholder="请输入密码"
                bind:value={password}
                required
            /></label
        > -->

        <div class="button_group" style="margin: 10px;">
            <!-- <button on:click={login}>Log in</button> -->
            <Button variant="raised" on:click={login} style="margin:auto 10px;">
                <Label>Log in</Label>
            </Button>
            <!-- <button on:click={rigester}>Sign up</button> -->
            <Button
                variant="outlined"
                on:click={rigester}
                style="margin:auto 10px;"
            >
                <Label>Log in</Label>
            </Button>

            <Snackbar bind:this={snackbarWarning} class="demo-warning">
                <Label>请输入用户名和密码</Label>
                <Actions>
                    <IconButton class="material-icons" title="Dismiss">×</IconButton
                    >
                </Actions>
            </Snackbar>
        </div>
    </div>
</div>

<style>
    .page,
    .login-form {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        align-content: center;

    }

    .login-form {
        width: 500px;
        height: 300px;
        border: 1px solid gainsboro;
        border-radius: 5px;

        /* box-shadow: grey; */
    }
    /* input {
        width: 250px;
        height: 25px;
        margin: 5px;
        padding: 3px;
        border-radius: 5px;
    } */
    /*
    button:hover {
        background-color: rgb(47, 98, 192);
    } */
    @material/elevation/mdc-elevation
</style>
