import { EmptyNameRequest, StateModelIF } from '@/interfaces'

export const stateModel: StateModelIF = {
  currentJsDate: null,
  tombstone: {
    keycloakRoles: [],
    authRoles: [],
    userInfo: null,
    businessId: '',
    entityType: null,
    currentDate: '',
    filingDateTime: '',
    filingId: 0,
    correctedFilingId: null,
    isSaving: false,
    isSavingResuming: false,
    isFilingPaying: false,
    ignoreChanges: false,
    haveChanges: false
  },
  newAlteration: {
    appValidate: false,
    provisionsRemoved: null,
    courtOrder: {
      fileNumber: '',
      hasPlanOfArrangement: false
    },
    validComponents: {
      isValidResolutionDate: true
    },
    validFlags: {
      isValidEffectiveDate: true,
      isValidFileNum: true, // Staff only
      isValidCertify: false, // initialize to false (unsigned)
      isValidStaffPayment: true, // Staff Only
      isValidDocumentOptionalEmail: true
    }
  },
  accountInformation: {
    accountType: '',
    id: null,
    label: '',
    type: ''
  },
  businessInformation: {
    legalType: null,
    identifier: ''
  },
  nameRequest: {
    legalType: null,
    legalName: '',
    nrNumber: '',
    details: {},
    applicant: {
      firstName: '',
      middleName: '',
      lastName: '',
      emailAddress: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      countryTypeCode: '',
      postalCode: '',
      stateProvinceCode: ''
    },
    filingId: null
  },
  nameTranslations: [],
  effectiveDateTime: {
    isFutureEffective: null,
    dateTimeString: ''
  },
  certifyState: {
    valid: false,
    certifiedBy: ''
  },
  documentDelivery: {
    documentOptionalEmail: ''
  },
  defineCompanyStep: {
    valid: false,
    changed: false,
    businessContact: {
      email: '',
      confirmEmail: '',
      phone: '',
      extension: ''
    },
    officeAddresses: {},
    folioNumber: ''
  },
  peopleAndRolesStep: {
    valid: false,
    changed: false,
    orgPeople: []
  },
  shareStructureStep: {
    valid: false,
    changed: false,
    resolutionDates: [],
    shareClasses: []
  },
  incorporationAgreementStep: {
    valid: false,
    changed: false,
    agreementType: null
  },
  originalIA: {
    header: {
      name: '',
      certifiedBy: '',
      date: '',
      folioNumber: '',
      effectiveDate: '',
      isFutureEffective: null
    },
    business: {
      legalType: null,
      identifier: ''
    },
    incorporationApplication: {
      nameRequest: {
        legalType: ''
      },
      nameTranslations: [],
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
  originalAlteration: {
    header: {
      name: '',
      certifiedBy: '',
      date: '',
      folioNumber: '',
      effectiveDate: '',
      isFutureEffective: null
    },
    business: {
      foundingDate: '',
      legalName: '',
      legalType: '',
      identifier: ''
    },
    alteration: {
      provisionsRemoved: null,
      business: {
        legalType: null,
        identifier: ''
      },
      nameRequest: { ...EmptyNameRequest },
      nameTranslations: [],
      shareStructure: {
        resolutionDates: [],
        shareClasses: []
      },
      contactPoint: {
        email: '',
        phone: '',
        extension: ','
      },
      courtOrder: {
        fileNumber: '',
        hasPlanOfArrangement: false
      }
    }
  },
  originalSnapshot: null,
  staffPaymentStep: {
    valid: false,
    staffPayment: {
      option: NaN,
      routingSlipNumber: '',
      bcolAccountNumber: '',
      datNumber: '',
      folioNumber: '',
      isPriority: false
    }
  },
  filingData: {
    filingTypeCode: null,
    entityType: null,
    priority: false,
    waiveFees: false
  },
  detail: {
    valid: false,
    comment: ''
  },
  editingFlags: {
    companyName: false,
    nameTranslations: false,
    officeAddresses: false,
    peopleAndRoles: false,
    shareStructure: false,
    incorporationAgreement: false
  },
  summaryMode: false
}
