<template>
    <div style="position: absolute; width: 30px; height: 30px; right: 0; top: 0">
        <button type="button" @click="copyText(inputId)"
                class="b-form-field__ico b-form-field__ico_content_copy"
                title="Копировать">
        </button>
        <div class="tooltip fade top" :class="[copied ? 'in' : '']" style="top: -38px; left: -25.5px; display: block;"><div class="tooltip-arrow" style="left: 50.625%;"></div><div class="tooltip-inner">Скопировано</div></div>
    </div>

</template>

<script>
    export default {
        name: 'CopyText',
        data: function () {
            return {
                copied: false
            }
        },
        props:['inputId'],
        methods: {
            copyText: function (id) {
                let fieldLink = document.getElementById(id);
                let range = document.createRange();
                range.selectNode(fieldLink, range);
                window.getSelection().addRange(range);

                try {
                    let successful = document.execCommand('copy');
                    this.copied = true;
                    setTimeout(() => {
                        this.copied = false;
                    }, 5000)
                    //var msg = successful ? 'successful' : 'unsuccessful';
                    //console.log('Copy email command was ' + msg);
                } catch (err) {
                    //console.log('Oops, unable to copy');
                }

                window.getSelection().removeAllRanges();
            }
        }
    }
</script>