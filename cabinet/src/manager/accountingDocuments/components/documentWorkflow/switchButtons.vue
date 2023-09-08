<template>
    <span>
        <md-button class="md-raised"
                   v-if="isViewTab()"
                   @click="docViewSwitch('workflow')">
            <md-icon>library_books</md-icon>
            Документооборот
        </md-button>
        <md-button class="md-raised"
                   v-else
                   @click="docViewSwitch('view')">
            <md-icon>library_books</md-icon>
            Просмотр документа
        </md-button>
    </span>
</template>

<script>
    export default {
        name: "switchButtons",
        data: () => ({
            tab: null,
        }),
        methods: {
            docViewSwitch: function (tab) {
                this.tab = tab;
                this.$router.push({ name: this.tab });
            },
            isViewTab: function() {
                return this.tab === 'view' || this.$router.currentRoute.name === 'view';
            }
        },
    }
</script>

<style scoped>

</style>