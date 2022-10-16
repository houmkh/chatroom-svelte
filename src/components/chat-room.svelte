<script>
    import {
        Grid,
        Row,
        Column,
        TextArea,
        FileUploaderButton,
        SkeletonText,
        Button,
    } from "carbon-components-svelte";
    /*
    TODO
    1.实现发送文件  选中文件后确认发送（有个文件状态）
    2.实现发送消息 点击发送消息按钮 将文本框的内容发送出去
    3.接收消息
    */
    let msgs = [
        {
            username: "xxx",
            msg: "xxx",
        },
    ];
</script>

<div class="chat-room">
    <Grid>
        <Row padding style="border:1px solid black;">
            <SkeletonText paragraph lines={15} />
        </Row>

        <Row>
            <TextArea id="send-msg" rows={4} />
        </Row>
        <Row>
            <FileUploaderButton labelText="发送文件" />
            <Button size="field" kind="ghost">发送消息</Button>
        </Row>
    </Grid>
</div>

<style>
    .chat-room {
        float: right;
    }
</style>
