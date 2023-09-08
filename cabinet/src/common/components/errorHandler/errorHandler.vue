<template>
    <div>
        <div class="wrap-error">
            <span class="code">{{ code }}</span>
            <h3 class="message">{{ message }}</h3>
        </div>
    </div>
</template>

<script>
    export default {
        name: "error-handler",
        props: {
            code: String,
            message: String,
        }
    }
</script>

<style>
    .wrap-error {
        text-align: center;
    }

    .wrap-error .code {
        letter-spacing: -10px;
        margin-top: 0px;
        line-height: 158px;
        font-size: 158px;
        font-weight: 300;
        color: #7bbbd6;
        text-align: right;
    }
</style>