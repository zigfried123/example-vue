export default {
    props: {
        accessRulesJson: String,
    },
    computed: {
        canEdit() {
            return JSON.parse(this.accessRulesJson).canEdit;
        },
        canExecute() {
            return JSON.parse(this.accessRulesJson).canExecute;
        },
        canUnexecute() {
            return JSON.parse(this.accessRulesJson).canUnexecute;
        },
    }
}