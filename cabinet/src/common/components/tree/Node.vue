<template>
    <li class="node" v-if="model.found">
        <span class="node__open-close" v-if="isFolder" @click="toggle">{{model.open ? '–' : '+'}}</span>
        <label class="node__selector custom-form-field">
            <input class="custom-form-field__field" type="checkbox" v-bind:checked="model.checked" @click="handleCheck">
            <span class="custom-form-field__pseudo" :class="{'custom-form-field__pseudo_child-checked': model.childchecked}"></span>
        </label>
        <span class="node__name" @click="toggle">
            <Backlight :text="model.name" :q="sharedState.q" :lengthQ="sharedState.lengthQ"/>
        </span>
        <span v-if="model.recursion" style="color:red">была</span>
        <ul v-if="model.open" class="list_content_tree-with-search">
            <Node v-for="model in model.inners" :model="model" :key="model.id"></Node>
        </ul>
    </li>
</template>

<script>

    import Store from './Store'
    import Backlight from './Backlight.vue'

    export default {
        name: 'Node',
        props: {
            model: Object
        },
        data () {
            return {
                sharedState: Store.state
            }
        },
        components: {
            Backlight
        },
        computed: {
            isFolder() {
                return this.model.inners && this.model.inners.length
            }
        },
        methods: {
            toggle() {
                if (this.isFolder) {
                    this.model.open = !this.model.open
                }
            },
            handleCheck(e) {

                if(Store.state.unique && Store.state.values.length && !this.model.checked) {
                    e.preventDefault();
                    this.sharedState.message.text = 'Можно выбрать только одно значение';
                    this.sharedState.message.visible = true;
                } else {
                    Store.setChecked(this.model, Store.state.tree);
                    Store.parentChildCheckedClean(Store.state.tree);
                    Store.parentChildChecked(Store.state.tree);
                    this.sharedState.message.visible = false;
                }
            }
        }
    }
</script>

<style scoped>
    .node {
        vertical-align: middle;
        padding-left: 26px;
        position: relative;
    }
    .node__open-close {
        cursor: pointer;
        position: absolute;
        left: 0;
        top: 4px;
        display: inline-block;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 1px solid #333;
        color: #333;
        text-align: center;
        line-height: 12px;
        font-size: 16px;
    }
    .node__selector {
        display: inline-block;
        vertical-align: middle;
        margin: 0;
    }
    .node__name {
        display: inline-block;
        vertical-align: middle;
        cursor: pointer;
    }

    .custom-form-field {
        position: relative;
        width: 16px;
        height: 16px;
    }
    .custom-form-field__field {
        opacity: 0;
    }
    .custom-form-field__pseudo {
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        border: 1px solid #333;
        background: #fff;
    }
    .custom-form-field__pseudo_child-checked::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        background: #333;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .custom-form-field__field:checked + .custom-form-field__pseudo::after,
    .custom-form-field__field:checked + .custom-form-field__pseudo_child-checked::after{
        content: '\2714';
        position: absolute;
        background: none;
        width: auto;
        height: auto;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>