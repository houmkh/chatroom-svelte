<script>
    import {
        FluidForm,
        TextInput,
        PasswordInput,
        ButtonSet,
        Button,
        TextInputSkeleton,
    } from "carbon-components-svelte";

    import { params, replace } from "svelte-spa-router";

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
            .then((value) =>value.json())
                .catch( console.error)
                .then((value) => {
                    uid = value.uid;
                    // if(value.privilege == 1)
                    replace_url = "/chat/" + uid + "/" + username;
                    console.log(value);
                    replace(replace_url);
                })
                .catch(console.error);
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
        }
    }

    /*
    TODO
    1.实现将登录数据传给后台
    2.实现将注册数据传给后台
    */
</script>

<div class="login-form">
    <!-- {invalid}
    invalidText="用户名不能为空" -->
    <!-- <FluidForm>
        <TextInput
            labelText="用户名"
            placeholder="请输入用户名"
            required
            bind:value={username}
        />
        <TextInput
            required
            type="password"
            labelText="密码"
            placeholder="请输入密码"
            bind:value={password}
        />
        <ButtonSet>
            <Button type="submit" on:click={login}>Log in</Button>
            <Button kind="ghost" on:click={rigester}>Sign up</Button>
        </ButtonSet>
    </FluidForm> -->
    <input placeholder="请输入用户名" bind:value={username} />
    <input type="password" placeholder="请输入密码" bind:value={password} />
    <button on:click={login}>Log in</button>
    <button on:click={rigester}>Sign up</button>
</div>

<style>
    .login-form {
        width: 800px;
        height: 500px;
        box-sizing: border-box;
        border: 1px solid gainsboro;
        border-radius: 5px;
        margin: auto;
        display: flex;
        flex-flow: column;
        justify-content: center;
    }
    input{
        height: 45px;
        margin: 5px;
        padding: 3px;
        border-radius: 5px;
    }
    button{
        height: 40px;
        margin: 5px;
        padding: 3px;
        border-radius: 5px;
        background-color: blanchedalmond;
    }
</style>
