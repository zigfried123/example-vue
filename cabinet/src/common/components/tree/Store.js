import axios from 'axios';

export default {
    debug: process.env.NODE_ENV !== 'production',
    state: {
        url: null,
        values: null,
        inputSelector: null,
        tree: '',
        q: '',
        lengthQ: 1,
        loading: false,
        unique: false,
        message: {
            visible: false,
            text: ''
        }
    },

    loadTree(callback) {
        let self = this,
            url = this.state.url;

        this.state.message.visible = false;
        this.state.message.text = '';
        this.state.q = '';

       /* if(this.getCacheTree(url)) {
            let data = this.getCacheTree(url);
            initTree(JSON.parse(data));

            if(typeof callback === 'function') {
                callback();
            }

        } else {*/
            this.state.loading = true;
            axios.get(this.state.url)
                .then((response) => {
                    return response.data;
                })
                .then((response) => {
                    let data = response.roots;
                    //window.localStorage.setItem(window.btoa(url), JSON.stringify(data)); // кэшируем в localStorage
                    initTree(data);
                    this.state.loading = false;
                    if(typeof callback === 'function') {
                        callback();
                    }
                })
                .catch();
        //}

        function initTree(data) {
            self.defaultStateTree(data);
            self.state.tree = data;

            let arr = Object.keys(self.state.values).map((i) => {
                return self.state.values[i].id;
            });

            if(arr && arr.length) {
                self.setCheckedOutInput(arr, self.state.tree)
                self.parentChildChecked(self.state.tree)
            }
        }

    },

    getCacheTree(url) {
        let myStorage = window.localStorage,
            urlBase64 = window.btoa(url);

        if(myStorage.getItem(urlBase64)) {
            return myStorage.getItem(urlBase64);
        } else {
            return false;
        }
    },

    defaultStateTree (state) {
        for(let node in state) {
            let item = state[node];
            item.found = true;
            item.open = false;
            item.checked = false;
            item.childchecked = false;
            if(item.inners && item.inners.length) {
                this.defaultStateTree(item.inners);
            }
        }
    },

    search (str, state) {
        let q = str.toLowerCase();
        for(let node in state) {
            let item = state[node];
            if(item.name.toLowerCase().indexOf(q) !== -1 || q == '') {
                item.found = true;
            }

            if(item.inners && item.inners.length) {
                this.search(q, item.inners);
            }
        }
    },

    setChecked(model, state) {
        for(let node in state) {
            let item = state[node];
            if(item === model) {
                item.checked = !item.checked;
                this.updateValues(item);

                // Если выбираем родителя, то у всех детей unchecked
                if(item.checked && item.inners && item.inners.length) {
                    this.setUnCheckedAll (item.inners);
                }

            } else if(item.inners && item.inners.length) {
                this.setChecked(model, item.inners);
            }
        }
    },

    setUnCheckedAll(state) {
        for(let node in state) {
            let item = state[node];
            item.checked = false;
            item.childchecked = false;
            this.updateValues(item);

            if(item.inners && item.inners.length) {
                this.setUnCheckedAll(item.inners);
            }
        }
    },

    showCheckedAll(state) {
        for(let node in state) {
            let item = state[node];

            if (item.childchecked) item.open = true;

            if(item.inners && item.inners.length) {
                this.showCheckedAll(item.inners);
            }
        }
    },

    updateValues(item) {
        let arr = Object.keys(this.state.values).map((i) => {
            return this.state.values[i].id;
        });
        if(item.checked && arr.indexOf(item.id) === -1) {
            this.state.values.push({
                id: item.id,
                name: item.name
            });
        } else {
            if(arr.indexOf(item.id) !== -1) {
                this.state.values.splice(arr.indexOf(item.id), 1);
            }
        }
    },

    setCheckedOutInput(arr, state) {
        for(let node in state) {
            let item = state[node];
            if(arr.indexOf(item.id) !== -1) {
                item.checked = true;
            }
            if(item.inners && item.inners.length) {
                this.setCheckedOutInput(arr, item.inners);
            }
        }
    },

    parentFound(state) {

        let found = false;
        for(let node in state) {
            let item = state[node];
            if(item.inners && item.inners.length && this.parentFound(item.inners)) {
                item.found = true;
            }

            if(item.found) found = true;
        }
        return found;
    },

    foundClean (state) {
        for(let node in state) {
            let item = state[node];
            item.found = false;
            if(item.inners && item.inners.length) {
                this.foundClean(item.inners);
            }
        }
    },

    parentChildChecked (state) {
        let checked = false;
        for(let node in state) {
            let item = state[node];

            if(item.inners && item.inners.length && this.parentChildChecked(item.inners)) {
                item.childchecked = true;

                // Если дети выбраны, то у родителя checked отменяется
                item.checked = false;
                this.updateValues(item);
            }

            if(item.checked || item.childchecked) {
                checked = true;
            }
        }
        return checked;
    },

    parentChildCheckedClean (state) {
        for(let node in state) {
            let item = state[node];
            item.childchecked = false;
            if(item.inners && item.inners.length) {
                this.parentChildCheckedClean(item.inners);
            }
        }
    },

    setQ (q) {
        if(this.debug) console.log('Вызвана setQ c', q);
        this.state.q = q;
    },
    setCount(n){
        this.state.count = n;
    },
    setRatio(n){
        this.state.ratio = n;
    },
    setLevels(n){
        this.state.levels = n;
    },
    setLengthQ(n){
        this.state.lengthQ = n;
    }
}