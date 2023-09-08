import { mount } from 'vue-test-utils'
import Datepicker from '../../src/manager/accountingDocuments/components/Datepicker';


describe('Datepicker component', () => {
    const wrapper = mount(Datepicker)

    it('Check markup if disabled=false', () => {
        wrapper.setProps({ disabled: false });
        expect(wrapper.contains('md-datepicker')).toBe(true);
        expect(wrapper.contains('md-input')).toBe(false);
    })

    it('Check markup if disabled=true', () => {
        wrapper.setProps({ disabled: true });
        expect(wrapper.contains('md-datepicker')).toBe(false);
        expect(wrapper.contains('md-input')).toBe(true);
    })
})
