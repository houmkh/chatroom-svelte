<script>
    import {
        FluidForm,
        TextInput,
        PasswordInput,
        ButtonSet,
        Button,
        TextInputSkeleton,
    } from "carbon-components-svelte";

    let username="", password="";
    let invalid;
    $:invalid = (username===""?true:false);
    function submit_form() {
        if(username!==""&&password!=="")
        {
            fetch()
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
    <FluidForm>
        <TextInput
            light

            labelText="用户名"
            placeholder="请输入用户名"
            required
            bind:value={username}
        />
        <TextInput
            light
            required
            type="password"
            labelText="密码"
            placeholder="请输入密码"
            bind:value={password}
        />

        <ButtonSet>
            <Button type="submit" on:click={submit_form}>Log in</Button>
            <Button kind="ghost" on:click={submit_form}>Sign up</Button>
        </ButtonSet>
    </FluidForm>
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
</style>
