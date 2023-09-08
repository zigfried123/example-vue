import { mount } from 'vue-test-utils'
import dialogAddBank from '../../../../../../src/common/contractors/selfEmployed/bankAccounts/components/dialogAddBank';


describe('dialogAddBank component', () => {
    const wrapper = mount(dialogAddBank)

    it('contain name input component', () => {
        expect(wrapper.contains('md-input#name')).toBe(true)
    })
    it('contain bik input component', () => {
        expect(wrapper.contains('md-input#bik')).toBe(true)
    })
    it('contain checkingAccount input component', () => {
        expect(wrapper.contains('md-input#checkingAccount')).toBe(true)
    })
    it('contain correspondentAccount input component', () => {
        expect(wrapper.contains('md-input#correspondentAccount')).toBe(true)
    })

    const buttonClose = wrapper.find('.md-accent');
    it('button close click should close form - emit action outside', () => {
        buttonClose.trigger('click')
        expect(wrapper.emitted().close).toBeTruthy()
    });

    it("sending data with 4 arguments on adding button click", () => {

        wrapper.setData({
            name: 'Test',
            bik: '123456789',
            checkingAccount: '12345678901234567890',
            correspondentAccount: '12345678901234567890',
        })

        expect(wrapper.vm.name).toBe('Test')
        expect(wrapper.vm.bik).toBe("123456789")
        expect(wrapper.vm.checkingAccount).toBe('12345678901234567890')
        expect(wrapper.vm.correspondentAccount).toBe("12345678901234567890")

        wrapper.find('#addBankAccBtn').trigger("click");
        expect(wrapper.emitted().onClickAddBankAccount).toBeTruthy()
        expect(wrapper.vm.$v.$invalid).toBe(false);
    });

    it("not sending bad bik", () => {
        wrapper.setData({
            bik: '12345678',
        });
        wrapper.find('#addBankAccBtn').trigger("click");
                expect(wrapper.vm.$v.$invalid).toBe(true);


    });
    it("not sending bad checkingAccount", () => {
        wrapper.setData({
            bik: '123456789',
            checkingAccount: '12346789hiд123456789',
        })
        wrapper.find('#addBankAccBtn').trigger("click");
                expect(wrapper.vm.$v.$invalid).toBe(true);

    });
    it("not sending bad correspondentAccount", () => {
        wrapper.setData({
            checkingAccount: '1234678901234567890',
            correspondentAccount: '12345678901j+4567890',
        })
        wrapper.find('#addBankAccBtn').trigger("click");
                expect(wrapper.vm.$v.$invalid).toBe(true);

    });





})
