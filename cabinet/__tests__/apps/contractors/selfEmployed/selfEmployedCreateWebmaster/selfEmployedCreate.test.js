import {mount, createLocalVue} from 'vue-test-utils';
import Vuex from 'vuex';
import selfEmployedCreateWebmaster from '../../../../../src/webmaster/contractors/selfEmployed/create/selfEmployedCreate.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('selfEmployedCreateWebmaster', () => {

    let store;
    let actions;
    let methods;

    beforeEach(() => {
        actions = {
            CREATE_SELF_EMPLOYED: jest.fn(),
        };

        store = new Vuex.Store({
            actions
        });
        methods = {
            isCreated() {
                return true;
            },
        }
    });

    it('contain title with correct name', () => {
        const wrapper = mount(
            selfEmployedCreateWebmaster, {
            store,
            localVue,
            methods: methods
        });

        expect(wrapper.contains('h4')).toBe(true)
        expect(wrapper.find("h4").text()).toBe("Создание самозанятого")
    });

    it('validate FIO', () => {
        let names = providerName();

        for(let index in names) {
            let item = names[index];

            const wrapper = mount(
                selfEmployedCreateWebmaster, {
                    store,
                    localVue,
                    methods: methods,
                    computed: {
                        lastName: () => item.name,
                        firstName: () => item.name,
                        middleName: () => item.name,
                    }
                });

            wrapper.find("form").trigger("submit.prevent");

            expect(wrapper.vm.$v.lastName.$error).toBe(item.invalid);
            expect(wrapper.vm.$v.firstName.$error).toBe(item.invalid);
            expect(wrapper.vm.$v.middleName.$error).toBe(item.invalid);
        }
    });

    it('validate passport number', () => {
        let numbers = providerPassportNumber();

        for(let index in numbers) {
            let item = numbers[index];

            const wrapper = mount(
                selfEmployedCreateWebmaster, {
                    store,
                    localVue,
                    methods: methods,
                    computed: {
                        passportNumber: () => item.number,
                    }
                });

            wrapper.find("form").trigger("submit.prevent");

            expect(wrapper.vm.$v.passportNumber.$error).toBe(item.invalid);
        }
    });

    it('validate passport series', () => {
        let series = providerPassportSeries();

        for(let index in series) {
            let item = series[index];

            const wrapper = mount(
                selfEmployedCreateWebmaster, {
                    store,
                    localVue,
                    methods: methods,
                    computed: {
                        passportSeries: () => item.number,
                    }
                });

            wrapper.find("form").trigger("submit.prevent");

            expect(wrapper.vm.$v.passportSeries.$error).toBe(item.invalid);
        }
    });

    it('validate inn', () => {
        let inns = providerInn();

        for(let index in inns) {
            let item = inns[index];

            const wrapper = mount(
                selfEmployedCreateWebmaster, {
                    store,
                    localVue,
                    methods: methods,
                    computed: {
                        inn: () => item.number,
                    }
                });

            wrapper.find("form").trigger("submit.prevent");

            expect(wrapper.vm.$v.inn.$error).toBe(item.invalid);
        }
    });

    it('success create', () => {
        const wrapper = mount(
            selfEmployedCreateWebmaster, {
                store,
                localVue,
                methods: methods,
                computed: {
                    firstName: () => 'Иван',
                    lastName: () => 'Иванович',
                    middleName: () => 'Иванов',
                    passportSeries: () => '1234',
                    passportNumber: () => '567890',
                    passportIssuedBy: () => 'УФМС России',
                    passportIssuedDate: () => '11-11-2011',
                    passportRegistration: () => 'г. Москва',
                    inn: () => '123456789012',
                    phone: () => '89123456789',
                    email: () => 'test@example.com',
                }
            });
        wrapper.vm.saveSelfEmployed();
        expect(actions.CREATE_SELF_EMPLOYED).toHaveBeenCalled();
    });

    it('incorrect create', () => {
        const wrapper = mount(
            selfEmployedCreateWebmaster, {
                store,
                localVue,
                methods: methods,
                computed: {
                    firstName: () => 'Иван!',
                    lastName: () => 'Иванович',
                    middleName: () => 'Иванов',
                    passportSeries: () => '1234',
                    passportNumber: () => '567890',
                    passportIssuedBy: () => 'УФМС России',
                    passportIssuedDate: () => '11-11-2011',
                    passportRegistration: () => 'г. Москва',
                    inn: () => 'fail',
                    phone: () => '89123456789',
                    email: () => 'test@example.com',
                }
            });
        wrapper.vm.saveSelfEmployed();
        expect(actions.CREATE_SELF_EMPLOYED).not.toHaveBeenCalled();
    });
});

const providerName = () => {
    return [
        {
            name: 'Иванов',
            invalid: false,
        },
        {
            name: 'Иванов оглы',
            invalid: false,
        },
        {
            name: 'Иванов Оглы',
            invalid: false,
        },
        {
            name: 'Иванов-Петров',
            invalid: false,
        },
        {
            name: 'иванов-петров',
            invalid: false,
        },
        {
            name: '!Иванов',
            invalid: true,
        },
        {
            name: 'Иванов!',
            invalid: true,
        },
        {
            name: 'Ива_нов',
            invalid: true,
        },
        {
            name: 'Иванов-',
            invalid: true,
        },
        {
            name: '-Иванов',
            invalid: true,
        },
    ]
}

const providerPassportNumber = () => {
    return [
        {
            number: '123456',
            invalid: false,
        },
        {
            number: '',
            invalid: true,
        },
        {
            number: '123',
            invalid: true,
        },
        {
            number: '12345w',
            invalid: true,
        },
    ]
}

const providerPassportSeries = () => {
    return [
        {
            number: '1234',
            invalid: false,
        },
        {
            number: '',
            invalid: true,
        },
        {
            number: '123',
            invalid: true,
        },
        {
            number: '123w',
            invalid: true,
        },
    ]
}


function providerInn() {
    return [
        {
            number: '123456789012',
            invalid: false,
        },
        {
            number: '',
            invalid: true,
        },
        {
            number: '345345345',
            invalid: true,
        },
        {
            number: '12345678901w',
            invalid: true,
        },
    ]
}