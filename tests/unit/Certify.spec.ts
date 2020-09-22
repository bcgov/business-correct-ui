//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
// the License. You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
// an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
// specific language governing permissions and limitations under the License.
//

import Vue from 'vue'
import Vuetify from 'vuetify'
import { mount, Wrapper } from '@vue/test-utils'
import { getVuexStore } from '@/store'

import { Certify } from '@/components/ReviewConfirm'
import { CertifyStatementIF } from '@/interfaces'

Vue.use(Vuetify)

const vuetify = new Vuetify({})
const store = getVuexStore()

// Input field selectors to test changes to the DOM elements.
const certifiedBySelector: string = 'input[type=text]'
const isCertifiedSelector: string = 'input[type=checkbox]'
const certifyStmtHeaderSelector: string = '.certify-stmt'
const certifyStatementListSelector: string = '.certify-statements'
const certifyClauseSelector: string = '.certify-clause'

const trimmedCertifier = 'Some Certifier'
const whitespaceCertifier = '  Some  Certifier  '
const defaultDate = '2019-01-01'
const certifyClause = 'Certify Clause'
const certifyStatementHeader = 'Certify Statement Header'
const certifyStatementLines = [
  'Statement Line 1',
  'Statement Line 2',
  'Statement Line 3'
]

/**
 * Returns the last event for a given name, to be used for testing event propagation in response to component changes.
 *
 * @param wrapper the wrapper for the component that is being tested.
 * @param name the name of the event that is to be returned.
 *
 * @returns the value of the last named event for the wrapper.
 */
function getLastEvent (wrapper: Wrapper<Certify>, name: string): any {
  const eventsList: Array<any> = wrapper.emitted(name)
  const events: Array<any> = eventsList[eventsList.length - 1]

  return events[0]
}

/**
 * Creates and mounts a component, so that it can be tested.
 *
 * @param certifiedBy the value to pass to the component for the name input. The default value is "undefined".
 * @param isCertified the value to pass to the component for the checkbox. The default value is "undefined".
 * @param currentDate the value to pass to the component for the static date. The default value is defaultDate.
 *
 * @returns a Wrapper<Certify> object with the given parameters.
 */
function createComponent (
  certifiedBy: string | undefined = undefined,
  date: string = defaultDate,
  certifyStatementResource: CertifyStatementIF = {
    entityType: 'CP',
    displayName: 'Cooperatives',
    certifyStatementHeader: certifyStatementHeader,
    certifyStatements: certifyStatementLines,
    certifyClause: certifyClause
  }
): Wrapper<Certify> {
  return mount(Certify, {
    vuetify,
    store,
    propsData: {
      certifiedBy,
      date,
      certifyStatementResource
    }
  })
}

describe('Certify component', () => {
  beforeEach(() => {
    store.state.stateModel.defineCompanyStep.businessContact.email = 'registered-office@example.com'
    store.state.stateModel.peopleAndRoles.orgPeople.push({
      officer: { email: 'completing-party@example.com' },
      roles: [{ roleType: 'Completing Party' }]
    })
  })

  it('has date displayed', () => {
    const wrapper: Wrapper<Certify> = createComponent()

    // The text should contain the date.
    expect(wrapper.text()).toContain(defaultDate)
  })

  it('has certify statement header', () => {
    const wrapper: Wrapper<Certify> = createComponent(trimmedCertifier)
    const statement: Wrapper<Vue> = wrapper.find(certifyStmtHeaderSelector)

    // The text should contain the certifier statement header.
    expect(statement.text()).toContain(certifyStatementHeader)
  })

  it('has certify statements', () => {
    const wrapper: Wrapper<Certify> = createComponent(trimmedCertifier)
    const statements: Wrapper<Vue> = wrapper.find(certifyStatementListSelector)

    // The text should contain each certify statement.
    expect(statements.text()).toContain(certifyStatementLines[0])
    expect(statements.text()).toContain(certifyStatementLines[1])
    expect(statements.text()).toContain(certifyStatementLines[2])
  })

  it('has certify clause', () => {
    const wrapper: Wrapper<Certify> = createComponent(trimmedCertifier)
    const statement: Wrapper<Vue> = wrapper.find(certifyClauseSelector)

    // The text should contain the certify clause.
    expect(statement.text()).toContain(certifyClause)
  })

  it('has certifier', () => {
    const wrapper: Wrapper<Certify> = createComponent(trimmedCertifier)
    const statement: Wrapper<Vue> = wrapper.find(certifyStmtHeaderSelector)

    // The text should contain the trimmed certifier name.
    expect(statement.text()).toContain(trimmedCertifier)
  })

  it('has trimmed certifier', () => {
    const wrapper: Wrapper<Certify> = createComponent(whitespaceCertifier)
    const statement: Wrapper<Vue> = wrapper.find(certifyStmtHeaderSelector)

    // The text should contain the trimmed certifier name.
    expect(statement.text()).toContain(trimmedCertifier)
  })

  it('has email addresses', () => {
    const wrapper: Wrapper<Certify> = createComponent()

    expect(wrapper.findAll('.email-addresses li').at(0).text()).toContain('registered-office@example.com')
    expect(wrapper.findAll('.email-addresses li').at(1).text()).toContain('completing-party@example.com')
  })

  it('is invalid when no props are defined', () => {
    const wrapper: Wrapper<Certify> = createComponent()

    // The last "valid" event should indicate that the form is invalid.
    expect(getLastEvent(wrapper, 'valid')).toBe(false)
  })

  it('is invalid when just certifiedBy is defined', () => {
    const wrapper: Wrapper<Certify> = createComponent(trimmedCertifier)
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    checkboxElement.setChecked(false)

    // The last "valid" event should indicate that the form is invalid.
    expect(getLastEvent(wrapper, 'valid')).toBe(false)
  })

  it('is invalid when just isCertified is defined', () => {
    const wrapper: Wrapper<Certify> = createComponent(undefined)
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    checkboxElement.setChecked()

    // The last "valid" event should indicate that the form is invalid.
    expect(getLastEvent(wrapper, 'valid')).toBe(false)
  })

  it('is valid when both certifiedBy and isCertified are defined', () => {
    const wrapper: Wrapper<Certify> = createComponent(trimmedCertifier)
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    checkboxElement.setChecked()

    // The last "valid" event should indicate that the form is valid.
    expect(getLastEvent(wrapper, 'valid')).toBe(true)
  })

  it('is valid when certifier is defined and contains whitespace', () => {
    const wrapper: Wrapper<Certify> = createComponent(whitespaceCertifier)
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    checkboxElement.setChecked()

    // The last "valid" event should indicate that the form is valid.
    expect(getLastEvent(wrapper, 'valid')).toBe(true)
  })

  it('is invalid when certifier is just whitespace', () => {
    const wrapper: Wrapper<Certify> = createComponent('  ')
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    checkboxElement.setChecked()

    // The last "valid" event should indicate that the form is invalid.
    expect(getLastEvent(wrapper, 'valid')).toBe(false)
  })

  it('is still invalid when certifier is just whitespace and form is certified', () => {
    const wrapper: Wrapper<Certify> = createComponent('  ')
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    checkboxElement.setChecked()

    // The last "valid" event should indicate that the form is invalid.
    expect(getLastEvent(wrapper, 'valid')).toBe(false)
  })

  it('has update event for certifiedBy', () => {
    const wrapper: Wrapper<Certify> = createComponent(' ')
    const inputElement: Wrapper<Vue> = wrapper.find(certifiedBySelector)
    inputElement.setValue(trimmedCertifier)

    // The last "update:certifiedBy" event should match the input.
    expect(getLastEvent(wrapper, 'certifiedBy')).toMatch(trimmedCertifier)
  })

  it('has update event for trimmed certifiedBy', () => {
    const wrapper: Wrapper<Certify> = createComponent(' ')
    const inputElement: Wrapper<Vue> = wrapper.find(certifiedBySelector)
    inputElement.setValue(whitespaceCertifier)

    // The last "update:certifiedBy" event should be a trimmed version of the input.
    expect(getLastEvent(wrapper, 'certifiedBy')).toMatch(trimmedCertifier)
  })

  it('has update event for isCertified = true', () => {
    const wrapper: Wrapper<Certify> = createComponent()
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    // toggle checkbox to guarantee a change event
    checkboxElement.setChecked(false)
    checkboxElement.setChecked(true)

    // The last "update:isCertified" event should indicate that the checkbox is checked.
    expect(getLastEvent(wrapper, 'isCertified')).toBe(true)
  })

  it('has update event for isCertified = false', () => {
    const wrapper: Wrapper<Certify> = createComponent()
    const checkboxElement: Wrapper<Vue> = wrapper.find(isCertifiedSelector)
    // toggle checkbox to guarantee a change event
    checkboxElement.setChecked(true)
    checkboxElement.setChecked(false)

    // The last "update:isCertified" event should indicate that the checkbox is unchecked.
    expect(getLastEvent(wrapper, 'isCertified')).toBe(false)
  })
})
