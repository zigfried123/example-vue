<template>
    <div>
        <md-toolbar class="md-dense l-breadcrumbs" md-elevation="0">
            <span v-for="(item, index) in breadcrumbs" :key="index">
                <a :href="item.url" class="md-title" v-if="index !== last">
                    {{ item.title }}
                </a>
                <span v-else class="md-title">
                    {{ item.title }}
                </span>
                <span class="md-title" v-if="index !== last"> / </span>
            </span>
        </md-toolbar>
    </div>
</template>

<script>
    export default {
        name: "breadcrumbs",
        props: {
            breadcrumbs: Array
        },
        computed: {
            last(){
                return Object.keys(this.breadcrumbs).length - 1;
            }
        }
    }
</script>

<style>
    .l-breadcrumbs {
        margin-bottom: 10px;
    }

    .l-breadcrumbs a, .l-breadcrumbs span{
        font-size: 16px;
    }
</style>