// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Action } from 'vuex-class'

// Interfaces
import { ActionBindingIF, StateModelIF, IncorporationFilingIF, IncorporationFilingBodyIF, GetterIF } from '@/interfaces'

// Constants
import { INCORPORATION_APPLICATION } from '@/constants'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Vue {
  // Global state
  @State stateModel!: StateModelIF

  // Global getters
  @Getter isTypeBcomp!: GetterIF
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getTempId!: string

  // Global actions
  @Action setEntityType!: ActionBindingIF
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslationState!: ActionBindingIF
  @Action setDefineCompanyStepValidity!: ActionBindingIF
  @Action setNameRequestState!: ActionBindingIF
  @Action setOrgPersonList!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDate!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF

  /** Constructs a filing body from store data. Used when saving a filing. */
  buildFiling (): IncorporationFilingIF {
    // Format DateTime for filing.
    const effectiveDate = this.stateModel.incorporationDateTime.effectiveDate
    const formattedDateTime = effectiveDate &&
      (effectiveDate.toISOString()).replace('Z', '+00:00')

    // Build filing.
    const filing: IncorporationFilingIF = {
      filing: {
        header: {
          name: INCORPORATION_APPLICATION,
          certifiedBy: this.stateModel.certifyState.certifiedBy,
          date: this.stateModel.currentDate,
          folioNumber: this.stateModel.defineCompanyStep.folioNumber,
          isFutureEffective: this.stateModel.incorporationDateTime.isFutureEffective
        },
        business: {
          legalType: this.stateModel.entityType,
          identifier: this.getTempId
        },
        incorporationApplication: {
          nameRequest: {
            legalType: this.stateModel.entityType
          },
          nameTranslations: {
            new: this.stateModel.nameTranslations
          },
          offices: this.stateModel.defineCompanyStep.officeAddresses,
          contactPoint: {
            email: this.stateModel.defineCompanyStep.businessContact.email,
            phone: this.stateModel.defineCompanyStep.businessContact.phone,
            extension: this.stateModel.defineCompanyStep.businessContact.extension
          },
          parties: this.stateModel.addPeopleAndRoleStep.orgPeople,
          shareClasses: this.stateModel.createShareStructureStep.shareClasses,
          incorporationAgreement: {
            agreementType: this.stateModel.incorporationAgreementStep.agreementType
          }
        }
      }
    }

    // If this is a named IA then save Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.filing.incorporationApplication.nameRequest.legalName = this.getApprovedName
    }

    // Pass the effective date only for a future effective filing.
    if (formattedDateTime) {
      filing.filing.header.effectiveDate = formattedDateTime
    }
    return filing
  }

  /**
   * Parses a draft filing into the store.
   * @param draftFiling the draft filing body to be parsed
   */
  parseDraft (draftFiling: any): void {
    // FUTURE: set types so each of these validate their parameters
    // ref: https://www.typescriptlang.org/docs/handbook/generics.html

    // NB: don't parse Name Request object -- NR is fetched from namex/NRO instead

    // Set Entity Type
    this.setEntityType(draftFiling.business.legalType)

    // Set Office Addresses
    this.setOfficeAddresses(draftFiling.incorporationApplication.offices)

    // Set Name Translations
    this.setNameTranslationState(draftFiling.incorporationApplication.nameTranslations?.new)

    // Set Contact Info
    const draftContact = {
      ...draftFiling.incorporationApplication.contactPoint,
      confirmEmail: draftFiling.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(draftContact)

    // Set Persons and Organizations
    this.setOrgPersonList(draftFiling.incorporationApplication.parties)

    // Set Share Structure
    this.setShareClasses(draftFiling.incorporationApplication.shareClasses)

    // Set Incorporation Agreement
    this.setIncorporationAgreementStepData({
      agreementType: draftFiling.incorporationApplication.incorporationAgreement?.agreementType
    })

    // Set Certify Form
    this.setCertifyState({
      valid: false,
      certifiedBy: draftFiling.header.certifiedBy
    })

    // Date check to improve UX and work around default effectiveDate set by backend.
    const draftEffectiveDate = draftFiling.header.effectiveDate
    const effectiveDate = draftEffectiveDate < new Date().toISOString() ? null : draftEffectiveDate

    // Set Future Effective Time
    this.setEffectiveDate(effectiveDate)
    this.setIsFutureEffective(!!effectiveDate)

    // Set Folio Number
    this.setFolioNumber(draftFiling.header.folioNumber)
  }

  /**
   * Parses a incorporation application filing into the store.
   * @param filing the filing body to be parsed
   */
  parseIncorpFiling (filing: IncorporationFilingBodyIF): void {
    // Set Entity Type
    this.setEntityType(filing.business.legalType)

    // Set Business Info
    this.setBusinessInformation(filing.business)

    // Set Name Request
    this.setNameRequestState(filing.incorporationApplication.nameRequest)

    // Set Office Addresses
    this.setOfficeAddresses(filing.incorporationApplication.offices)

    // Set Name Translations
    this.setNameTranslationState(filing.incorporationApplication.nameTranslations?.new)

    // Set Contact Info
    const contact = {
      ...filing.incorporationApplication.contactPoint,
      confirmEmail: filing.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(contact)

    // Set Persons and Organizations
    this.setOrgPersonList(filing.incorporationApplication.parties)

    // Set Share Structure
    this.setShareClasses(filing.incorporationApplication.shareClasses)

    // Set Incorporation Agreement
    this.setIncorporationAgreementStepData({
      agreementType: filing.incorporationApplication.incorporationAgreement?.agreementType
    })

    // Set Certify Form
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Date check to improve UX and work around default effectiveDate set by backend.
    let effectiveDate = filing.header.effectiveDate
    effectiveDate = effectiveDate < new Date().toISOString() ? null : effectiveDate

    // Set Future Effective Time
    this.setEffectiveDate(effectiveDate)
    this.setIsFutureEffective(!!effectiveDate)

    // Set Folio Number
    this.setFolioNumber(filing.header.folioNumber)
  }

  /**
   * Parses an alteration filing into the store.
   * @param filing the filing body to be parsed
   */
  parseAlteration (filing: any): void {
    // Alteration body to parse TBD
    // Will refactor above parse function into 1 generic filing parse function when we know more
  }
}
