import { IncorporationAddressIf, OrgPersonIF, ShareClassIF, StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  tombstone: {
    keycloakRoles: [],
    authRoles: [],
    userInfo: null,
    businessId: '',
    entityType: null,
    currentDate: '',
    filingDate: '',
    filingId: null,
    correctedFilingId: null,
    isSaving: false,
    isSavingResuming: false,
    isFilingPaying: false,
    ignoreChanges: false,
    haveChanges: false,
    haveCorrection: false
  },
  accountInformation: {
    accountType: '',
    id: null,
    label: '',
    type: ''
  },
  businessInformation: {
    legalType: '',
    identifier: ''
  },
  nameRequest: {
    legalType: null,
    legalName: '',
    nrNumber: '',
    details: {},
    applicant: {},
    filingId: null
  },
  nameTranslations: [],
  incorporationDateTime: {
    valid: false,
    isFutureEffective: false,
    effectiveDate: null
  },
  certifyState: {
    valid: false,
    certifiedBy: ''
  },
  defineCompanyStep: {
    valid: false,
    businessContact: {
      email: '',
      confirmEmail: '',
      phone: '',
      extension: ''
    },
    officeAddresses: {},
    folioNumber: null
  },
  addPeopleAndRoleStep: {
    valid: false,
    changed: false,
    orgPeople: []
  },
  createShareStructureStep: {
    valid: false,
    shareClasses: []
  },
  incorporationAgreementStep: {
    valid: false,
    agreementType: null
  },
  originalIA: {
    header: {
      name: '',
      certifiedBy: '',
      date: '',
      folioNumber: '',
      isFutureEffective: null
    },
    business: {
      legalType: '',
      identifier: ''
    },
    incorporationApplication: {
      nameRequest: {
        legalType: ''
      },
      nameTranslations: {
        new: []
      },
      offices: {},
      contactPoint: {
        email: '',
        phone: '',
        extension: ','
      },
      parties: [],
      shareStructure: {
        shareClasses: []
      },
      incorporationAgreement: {
        agreementType: ''
      }
    }
  },
  staffPayment: {
    option: NaN,
    routingSlipNumber: '',
    bcolAccountNumber: '',
    datNumber: '',
    folioNumber: '',
    isPriority: false
  }
}
