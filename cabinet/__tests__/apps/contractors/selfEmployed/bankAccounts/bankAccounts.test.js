import {
    shallow,
    createLocalVue
} from 'vue-test-utils'
import Vuex from 'vuex';
import bankAccounts from '../../../../../src/common/contractors/selfEmployed/bankAccounts/bankAccounts.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

describe('bankAccounts', () => {
    let store
    let mutations
    let actions
    let bankAccId = 57;
    beforeEach(() => {
        mutations = {
            SET_SELF_EMPLOYED_ID: jest.fn(),
            APPEND_BANK_ACCOUNTS: jest.fn(),
            DELETE_BANK_ACCOUNT: jest.fn(),
        }
        actions = {
            APPEND_BANK_ACCOUNTS: jest.fn(),
            DELETE_BANK_ACCOUNT: jest.fn(),
            ADD_BANK_ACCOUNT: jest.fn(),
        }
        store = new Vuex.Store({
            mutations,
            actions
        })
    })

    it('contain title with correct name', () => {
        const wrapper = shallow(bankAccounts, {
            store,
            localVue
        })
        expect(wrapper.contains('h4')).toBe(true)
        expect(wrapper.find("h4").text()).toBe("Банковские счета")
    })

    it('contain add bank button', () => {
        const wrapper = shallow(bankAccounts, {
            store,
            localVue
        })
        expect(wrapper.contains('md-button#addBankBtn')).toBe(true)
    })
    it('contain remove bank button', () => {
        const wrapper = shallow(bankAccounts, {
            computed: {
                bankAccounts: () => [
                    {
                        id: bankAccId,
                        name: 'SomeBank',
                        bik: '23423434',
                        correspondentAccount: '123456',
                        checkingAccount: '123456',
                    }
                ]
            },
            localVue,
            store
        })
        expect(wrapper.contains('.remove-btn')).toBe(true)
    })

    it('remove bank acc btn on click call remove action', () => {
        const wrapper = shallow(bankAccounts, {
            computed: {
                bankAccounts: () => [
                    {
                        id: bankAccId,
                        name: 'SomeBank',
                        bik: '23423434',
                        correspondentAccount: '123456',
                        checkingAccount: '123456',
                    }
                ]
            },
            localVue,
            store
        })

        wrapper.find('.remove-btn').trigger('click')
        expect(wrapper.vm.bankAccountIdForRemove).toBe(bankAccId)
        expect(wrapper.vm.activeConfirmRemove).toBe(true)
        wrapper.vm.onConfirmRemove()

        expect(actions.DELETE_BANK_ACCOUNT.mock.calls).toHaveLength(1)
        expect(actions.DELETE_BANK_ACCOUNT.mock.calls[0][1])
            .toEqual(bankAccId)
    })

    it('add bank acc btn on click call add action', () => {
        const wrapper = shallow(bankAccounts, {
            localVue,
            store
        })

        wrapper.vm.onClickAddBankAccount({
            id: bankAccId,
            name: 'SomeBank',
            bik: '23423434',
            correspondentAccount: '123456',
            checkingAccount: '123456',
        })

        expect(actions.ADD_BANK_ACCOUNT.mock.calls).toHaveLength(1)
        expect(actions.ADD_BANK_ACCOUNT.mock.calls[0][1])
            .toEqual({
                id: bankAccId,
                name: 'SomeBank',
                bik: '23423434',
                correspondentAccount: '123456',
                checkingAccount: '123456',
            })
    })

    it('add Bank Btn should open adding modal', () => {
        const wrapper = shallow(bankAccounts, {
            store,
            localVue
        })
        const addBankBtn = wrapper.find('md-button#addBankBtn');
        addBankBtn.trigger('click')
        expect(wrapper.vm.activeAddBankAccount).toBe(true)
    });
})