<template>
    <span v-html="textWithBacklight">{{ textWithBacklight }}</span>
</template>

<script>
    import Store from './Store'

    export default {
        name: 'Backlight',
        props: ['text', 'q', 'lengthQ'],
        computed: {
            textWithBacklight() {
                if(this.q.length >= this.lengthQ) {
                    var replace = this.q;
                    var re = new RegExp(replace,"ig");
                    return this.text.replace(re, (str) => '<span class="backlight">'+str+'</span>');
                } else {
                    return this.text;
                }
            }
        }
    }
</script>

<style>
    .backlight {
        background: rgba(255, 255, 0, 0.5);
    }
</style>