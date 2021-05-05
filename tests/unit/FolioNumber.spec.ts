// Libraries
import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import FolioNumber from '@/components/YourCompany/FolioNumber.vue'

Vue.use(Vuetify)
const vuetify = new Vuetify({})

xdescribe('Folio Number component', () => {
  it('displays editing view', () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '1234', isEditing: true },
      vuetify
    })

    expect(wrapper.find('#display-folio-number').exists()).toBe(false)
    expect(wrapper.find('#edit-folio-number').exists()).toBe(true)

    wrapper.destroy()
  })

  it('displays readonly view', () => {
    const wrapper = mount(FolioNumber, {
      propsData: { initialValue: '1234', isEditing: false },
      vuetify
    })

    expect(wrapper.find('#display-folio-number').exists()).toBe(true)
    expect(wrapper.find('#edit-folio-number').exists()).toBe(false)

    wrapper.destroy()
  })

  it('accepts empty folio number', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const input = wrapper.find('#folio-number-input')
    input.setValue('')
    input.trigger('change')
    await flushPromises()

    expect(wrapper.findAll('.v-messages__message').length).toBe(0)

    wrapper.destroy()
  })

  it('accepts valid folio number', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const input = wrapper.find('#folio-number-input')
    input.setValue('123ABCabc')
    input.trigger('change')
    await flushPromises()

    expect(wrapper.findAll('.v-messages__message').length).toBe(0)
    wrapper.destroy()
  })

  it('rejects folio number with invalid character', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const input = wrapper.find('#folio-number-input')
    input.setValue('_')
    input.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Invalid character')

    wrapper.destroy()
  })

  it('rejects folio number that is too long', async () => {
    const wrapper = mount(FolioNumber, {
      propsData: { isEditing: true },
      vuetify
    })
    const input = wrapper.find('#folio-number-input')
    input.setValue('123456789012345678901234567890123456789012345678901')
    input.trigger('change')
    await flushPromises()

    const messages = wrapper.findAll('.v-messages__message')
    expect(messages.length).toBe(1)
    expect(messages.at(0).text()).toBe('Cannot exceed 50 characters')

    wrapper.destroy()
  })
})
