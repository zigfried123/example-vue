export default {
    data: () => ({
        beforeSubmit: false
    }),
    computed: {
        isValidData() {
            return !this.$v.$invalid;
        },
    },
    methods: {
        getValidationClass(fieldName) {
            if (this.$v[fieldName].$dirty || this.beforeSubmit) {
                return {'md-invalid': this.$v[fieldName].$invalid};
            }
        },
        touchField(field){
            this.$v[field].$touch();
        },
        onSave(event, saveAndExecute){
            this.beforeSubmit = true;
            this.save(event, saveAndExecute);
        },
        onFieldChanged(val, field) {
            this[field] = val;
            this.$v[field].$touch();
        },
        touchFieldsInJsonData(jsonDataField)
        {
            if(this.$v['affiliateId'] != undefined){
                this.$v['affiliateId'].$touch();
            }

            for(let field in jsonDataField){
                switch(field){
                    case 'affiliate_id':
                        field = 'webmaster_id';
                }

                if(this.$v[field] != undefined) {
                    this.$v[field].$touch();
                }
            }
        }
    }
}
