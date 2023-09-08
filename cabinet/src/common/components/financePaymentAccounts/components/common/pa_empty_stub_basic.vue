<template>
    <div>
        <md-empty-state
                :md-icon="icon ? icon : 'chat_bubble_outline'"
                :md-label="label"
                :md-description="message">
        </md-empty-state>
    </div>
</template>

<script>
    export default {
        name: 'pa_empty_stub_basic',
        props: {
            message: {type: String},
            label: {type: String},
            icon: {type: String}
        },
    }
</script>