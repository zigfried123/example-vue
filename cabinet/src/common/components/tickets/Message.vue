<template>
    <div class="message" v-bind:class="[position]">
        <div class="info">
            <div>{{ date }} {{ author }}</div>
        </div>
        <div class="text">{{ text }}</div>
    </div>
</template>

<script>
    export default {
        name: 'ticket-chat-messsage',
        props: {
            text: {
                type: String,
                default: 'текст'
            },
            position: {
                type: String,
                default: 'left'
            },
            author: {
                type: String,
                default: 'author'
            },
            date: {
                type: String,
                default: '23.05.2018 11:11'
            }
        },
        mounted() {

        },
    }
</script>