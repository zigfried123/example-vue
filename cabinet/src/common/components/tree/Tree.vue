<template>
    <div class="universal-tree">
        <div class="universal-tree__info alert" v-if="sharedState.message.visible">{{sharedState.message.text}}</div>
        <div class="universal-tree__search">
            <Search/>
        </div>
        <div class="universal-tree__content">
            <img v-if="sharedState.loading" src="/assets/new/images/ajax-loader.gif" class="preloader" alt="">
            <ul v-if="!sharedState.loading" class="list_content_tree-with-search">
                <Node v-for="model in sharedState.tree" v-bind:model="model" :key="model.id"/>
            </ul>
        </div>
        <div class="universal-tree__tools">
            <span class="btn mini" @click="handleShowChecked"><i class="icon-search"></i> Показать выбранные</span>
            <span class="btn mini" @click="handleUnCheckedAll"><i class="icon-trash"></i> Очистить</span>
        </div>
    </div>
</template>

<script>
    import Store from './Store'
    import Node from './Node.vue'
    import Search from './Search.vue'
    import Tests from './Tests.vue'

    window.universalTreeStore = Store;

    export default {
        name: 'Tree',
        components: {
            Node,
            Search,
            Tests
        },
        props: [],
        data () {
            return {
                privateState: Object,
                sharedState: Store.state
            }
        },
        mounted () {

        },
        created() {

        },
        methods: {
            handleShowChecked() {
                Store.showCheckedAll(this.sharedState.tree)
            },
            handleUnCheckedAll() {
                Store.setUnCheckedAll (this.sharedState.tree);
            }
        }
    }
</script>

<style scoped>
    .universal-tree {
        position: relative;
    }

    .universal-tree__search {
        width: 100%;
        box-sizing: border-box;
        background: #fff;
        margin-bottom: 10px;
    }

    .universal-tree__content {
        max-height: 300px;
        overflow: auto;
        position: relative;
    }
    .universal-tree__content {
        margin-bottom: 10px;
    }
    .universal-tree__info {
        margin: 0 0 5px;
        padding: 0 10px;
    }
    .preloader {
        display: block;
        margin: 20px auto;
    }
</style>

<style>
    .list_content_tree-with-search {
        list-style: none;
        padding: 0;
        margin: 0;
    }
</style>