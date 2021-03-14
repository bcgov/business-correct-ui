// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'

// Interfaces
import {
  ActionBindingIF,
  AlterationFilingIF,
  BusinessSnapshotIF,
  CertifyIF,
  CorrectionFilingIF,
  EffectiveDateTimeIF,
  IncorporationAddressIf,
  IncorporationFilingIF,
  OrgPersonIF,
  ShareClassIF,
  NameTranslationIF,
  NameRequestIF,
  ShareStructureIF
} from '@/interfaces'

// Shared Interfaces
import { ContactPointIF, StaffPaymentIF } from '@bcrs-shared-components/interfaces'

// Constants
import { ActionTypes, EntityTypes, FilingTypes, RoleTypes } from '@/enums'
import { StaffPaymentOptions } from '@bcrs-shared-components/enums'

/**
 * Mixin that provides the integration with the Legal API.
 */
@Component({})
export default class FilingTemplateMixin extends Vue {
  // Global getters
  @Getter isNamedBusiness!: boolean
  @Getter getNameRequestNumber!: string
  @Getter getApprovedName!: string
  @Getter getBusinessId!: string
  @Getter getCurrentDate!: string
  @Getter getEntityType!: EntityTypes
  @Getter getCorrectedFilingId!: number
  @Getter getEffectiveDateTime!: EffectiveDateTimeIF
  @Getter getPeopleAndRoles!: OrgPersonIF[]
  @Getter getShareClasses!: ShareClassIF[]
  @Getter getFolioNumber!: string
  @Getter getStaffPayment!: StaffPaymentIF
  @Getter getDetailComment!: string
  @Getter getDefaultCorrectionDetailComment!: string
  @Getter getNameTranslations!: NameTranslationIF[]
  @Getter getNameRequest!: NameRequestIF
  @Getter getCertifyState!: CertifyIF
  @Getter getOfficeAddresses!: IncorporationAddressIf | {}
  @Getter getBusinessContact!: ContactPointIF
  @Getter getAgreementType!: string
  @Getter getOriginalSnapshot: BusinessSnapshotIF[]
  @Getter getNewResolutionDates!: string[]
  @Getter getSnapshotShareStructure!: ShareStructureIF
  @Getter hasBusinessNameChanged!: boolean
  @Getter hasNewNr!: boolean
  @Getter getNewAlteration!: any // FUTURE AlterationFilingIF

  // Global setters
  @Action setBusinessContact!: ActionBindingIF
  @Action setBusinessInformation!: ActionBindingIF
  @Action setEntityType!: ActionBindingIF
  @Action setOfficeAddresses!: ActionBindingIF
  @Action setNameTranslations!: ActionBindingIF
  @Action setNameRequest!: ActionBindingIF
  @Action setPeopleAndRoles!: ActionBindingIF
  @Action setCertifyState!: ActionBindingIF
  @Action setShareClasses!: ActionBindingIF
  @Action setEffectiveDateTimeString!: ActionBindingIF
  @Action setIsFutureEffective!: ActionBindingIF
  @Action setFolioNumber!: ActionBindingIF
  @Action setFilingDateTime!: ActionBindingIF
  @Action setIncorporationAgreementStepData!: ActionBindingIF
  @Action setStaffPayment!: ActionBindingIF
  @Action setDetailComment!: ActionBindingIF
  @Action setOriginalSnapshot!: ActionBindingIF
  @Action setProvisionsRemoved!: ActionBindingIF
  @Action setPreviousResolutionDates!: ActionBindingIF
  @Action setResolutionDates!: ActionBindingIF

  /**
   * Builds an Incorporation Application Correction filing body from store data. Used when saving a filing.
   * @param isDraft boolean indicating whether this is a draft
   * @returns the IA Correction filing body to save
   */
  buildIaCorrectionFiling (isDraft: boolean): CorrectionFilingIF {
    // if filing and paying, filter out removed entities and omit the 'action' property
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations
    if (!isDraft) {
      // Filter out parties actions
      parties = parties.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out class actions
      shareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out series actions
      for (const [index, share] of shareClasses.entries()) {
        shareClasses[index].series = share.series?.filter(x => x.action !== ActionTypes.REMOVED)
          .map((x) => { const { action, ...rest } = x; return rest })
      }

      // Filter out and modify name translation to match schema
      nameTranslations = this.prepareNameTranslations()
    }

    // Build filing.
    const filing: CorrectionFilingIF = {
      header: {
        name: FilingTypes.CORRECTION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate,
        folioNumber: this.getFolioNumber
      },
      business: {
        legalType: this.getEntityType,
        identifier: this.getBusinessId,
        legalName: this.getApprovedName
      },
      correction: {
        correctedFilingId: this.getCorrectedFilingId,
        correctedFilingType: FilingTypes.INCORPORATION_APPLICATION,
        correctedFilingDate: this.getCurrentDate,
        comment: `${this.getDefaultCorrectionDetailComment}\n${this.getDetailComment}`
      },
      incorporationApplication: {
        nameRequest: {
          legalType: this.getEntityType,
          legalName: this.getApprovedName,
          nrNumber: this.getNameRequestNumber
        },
        nameTranslations: nameTranslations,
        offices: this.getOfficeAddresses,
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          extension: this.getBusinessContact.extension
        },
        parties,
        shareStructure: {
          shareClasses
        },
        incorporationAgreement: {
          agreementType: this.getAgreementType
        }
      }
    }

    // If this is a named IA then save Name Request Number and Approved Name.
    if (this.isNamedBusiness) {
      filing.incorporationApplication.nameRequest.nrNumber = this.getNameRequestNumber
      filing.incorporationApplication.nameRequest.legalName = this.getApprovedName
    }

    // Populate Staff Payment according to payment option
    switch (this.getStaffPayment.option) {
      case StaffPaymentOptions.FAS:
        filing.header.routingSlipNumber = this.getStaffPayment.routingSlipNumber
        filing.header.priority = this.getStaffPayment.isPriority
        break

      case StaffPaymentOptions.BCOL:
        filing.header.bcolAccountNumber = this.getStaffPayment.bcolAccountNumber
        filing.header.datNumber = this.getStaffPayment.datNumber
        filing.header.folioNumber = this.getStaffPayment.folioNumber
        filing.header.priority = this.getStaffPayment.isPriority
        break

      case StaffPaymentOptions.NO_FEE:
        filing.header.waiveFees = true
        filing.header.priority = false
        break

      case StaffPaymentOptions.NONE: // should never happen
        break
    }

    return filing
  }

  /**
   * Builds an Alteration filing body from store data. Used when saving a filing.
   * @param isDraft boolean indicating whether this is a draft.
   * @returns the Alteration filing body.
   */
  buildAlterationFiling (isDraft: boolean): AlterationFilingIF {
    // if filing and paying, filter out removed entities and omit the 'action' property
    let parties = this.getPeopleAndRoles
    let shareClasses = this.getShareClasses
    let nameTranslations = this.getNameTranslations

    if (!isDraft) {
      // Filter out parties actions
      parties = parties.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out class actions
      shareClasses = shareClasses.filter(x => x.action !== ActionTypes.REMOVED)
        .map((x) => { const { action, ...rest } = x; return rest })

      // Filter out series actions
      for (const [index, share] of shareClasses.entries()) {
        shareClasses[index].series = share.series?.filter(x => x.action !== ActionTypes.REMOVED)
          .map((x) => { const { action, ...rest } = x; return rest })
      }

      // Filter out and modify name translation to match schema
      nameTranslations = this.prepareNameTranslations()
    }

    // Build filing.
    const filing: AlterationFilingIF = {
      header: {
        name: FilingTypes.ALTERATION,
        certifiedBy: this.getCertifyState.certifiedBy,
        date: this.getCurrentDate, // "absolute day" (YYYY-MM-DD in Pacific time)
        folioNumber: this.getFolioNumber || ''
      },
      business: {
        foundingDate: this.getOriginalSnapshot[0].business.foundingDateTime,
        legalType: this.getOriginalSnapshot[0].business.legalType,
        identifier: this.getOriginalSnapshot[0].business.identifier,
        legalName: this.getOriginalSnapshot[0].business.legalName
      },
      alteration: {
        provisionsRemoved: this.getNewAlteration.provisionsRemoved,
        business: {
          identifier: this.getBusinessId,
          legalType: this.getEntityType
        },
        nameRequest: { ...this.getNameRequest },
        nameTranslations: nameTranslations,
        shareStructure: {
          resolutionDates: this.getNewResolutionDates,
          shareClasses
        },
        contactPoint: {
          email: this.getBusinessContact.email,
          phone: this.getBusinessContact.phone,
          extension: this.getBusinessContact.extension
        }
      }
    }

    // If FED then set header fields
    if (this.getEffectiveDateTime.isFutureEffective) {
      filing.header.isFutureEffective = true
      const effectiveDate = new Date(this.getEffectiveDateTime.dateTimeString)
      filing.header.effectiveDate = effectiveDate.toISOString() // in UTC
    }

    // Include name request info when applicable
    if (this.hasNewNr || this.hasBusinessNameChanged) filing.alteration.nameRequest = { ...this.getNameRequest }

    return filing
  }

  /**
   * Prepare name translations for non draft correction
   */
  prepareNameTranslations () : NameTranslationIF[] {
    return this.getNameTranslations?.filter(x => x.action !== ActionTypes.REMOVED)
      .map(x => {
        let nameTranslation = {
          name: x.name
        }
        if (x.action !== ActionTypes.ADDED) {
          nameTranslation['id'] = x.id
        }
        return nameTranslation
      })
  }

  /**
   * Parses a correction filing into the store.
   * @param filing the correction filing body to be parsed
   */
  parseCorrection (filing: CorrectionFilingIF): void {
    // Set Business Information
    this.setBusinessInformation(filing.business)

    // Set Name Request
    this.setNameRequest(filing.incorporationApplication.nameRequest)

    // Set Name Translations
    // For the first time (when we initiate a correction) the `oldName` and `action` props
    // are not availablein the api response, which creates an issue of not having these props in store.
    // Due to missing props change event was not triggering if the action value is changed
    // (at the time of Delete there is no other prop change except action).
    // To handle this scenario I had to keep this structure.
    this.setNameTranslations(
      filing.incorporationApplication.nameTranslations?.map(x => {
        return {
          id: x.id,
          name: x.name,
          oldName: x.oldName || null,
          action: x.action || null
        }
      }) || []
    )

    // Set Office Addresses
    this.setOfficeAddresses(filing.incorporationApplication.offices)

    // Set Business Contact
    const contact = {
      ...filing.incorporationApplication.contactPoint,
      confirmEmail: filing.incorporationApplication.contactPoint.email
    }
    this.setBusinessContact(contact)

    // Set People and Roles
    this.setPeopleAndRoles(filing.incorporationApplication.parties || [])

    // Set Share Structure
    if (filing.incorporationApplication.shareStructure) {
      this.setShareClasses(filing.incorporationApplication.shareStructure.shareClasses)
    } else {
      // if it exists, load data from old schema
      const shareClasses = (filing.incorporationApplication as any).shareClasses
      if (shareClasses) {
        this.setShareClasses(shareClasses)
      } else {
        this.setShareClasses([])
      }
    }

    // Set Incorporation Agreement
    this.setIncorporationAgreementStepData({
      agreementType: filing.incorporationApplication.incorporationAgreement?.agreementType
    })

    // Set Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // load Detail Comment, removing the first line (default comment)
    const comment: string = filing.correction.comment || ''
    const detailComment = comment.split('\n').slice(1).join('\n')
    this.setDetailComment(detailComment)

    // Set Folio Number
    this.setFolioNumber(filing.header.folioNumber)

    // Set Filing Date
    this.setFilingDateTime(filing.header.date)

    // Set Effective Date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)

    // Set Staff Payment
    if (filing.header.routingSlipNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.FAS,
        routingSlipNumber: filing.header.routingSlipNumber,
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: filing.header.priority
      })
    } else if (filing.header.bcolAccountNumber) {
      this.setStaffPayment({
        option: StaffPaymentOptions.BCOL,
        routingSlipNumber: '',
        bcolAccountNumber: filing.header.bcolAccountNumber,
        datNumber: filing.header.datNumber,
        folioNumber: filing.header.folioNumber,
        isPriority: filing.header.priority
      })
    } else if (filing.header.waiveFees) {
      this.setStaffPayment({
        option: StaffPaymentOptions.NO_FEE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    } else {
      this.setStaffPayment({
        option: StaffPaymentOptions.NONE,
        routingSlipNumber: '',
        bcolAccountNumber: '',
        datNumber: '',
        folioNumber: '',
        isPriority: false
      })
    }
  }

  /**
   * Parses an alteration filing into the store.
   * @param filing The alteration filing body to be parsed
   * @param businessSnapshot The current business snapshot
   */
  parseAlteration (filing: AlterationFilingIF, businessSnapshot: BusinessSnapshotIF[]): void {
    if (businessSnapshot.length !== 6) throw new Error('Incomplete request responses  \'businessIdentifier\'')

    // Set original snapshot to store
    this.setOriginalSnapshot(businessSnapshot)

    // Set current entity type
    this.setEntityType(filing.alteration.business.legalType)

    // Set Business Information
    this.setBusinessInformation({ ...filing.business, ...filing.alteration.business })

    // Set Name Request
    this.setNameRequest(filing.alteration.nameRequest)

    // Set Name Translations
    this.setNameTranslations(
      filing.alteration.nameTranslations?.map(x => {
        return {
          id: x.id,
          name: x.name,
          oldName: x.oldName || null,
          action: x.action || null
        }
      }) || []
    )

    this.setProvisionsRemoved(filing.alteration.provisionsRemoved)

    // Set Office Addresses
    this.setOfficeAddresses(businessSnapshot[2])

    // Set Business Contact
    const contact = {
      ...filing.alteration.contactPoint,
      confirmEmail: filing.alteration.contactPoint.email
    }
    this.setBusinessContact(contact)

    // Set People and Roles
    this.setPeopleAndRoles(businessSnapshot[3].directors?.map(director => {
      return {
        officer: {
          firstName: director.officer.firstName,
          lastName: director.officer.lastName
        },
        mailingAddress: director.deliveryAddress,
        deliveryAddress: director.mailingAddress,
        roles: [
          {
            roleType: director.role in RoleTypes ? director.role
              : Object.values(RoleTypes).find(role => {
                if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                  return role
                }
              }),
            appointmentDate: director.appointmentDate,
            cessationDate: null
          }
        ]
      }
    }))

    // Set Share Structure
    this.setPreviousResolutionDates(this.getSnapshotShareStructure.resolutionDates)
    if (filing.alteration.shareStructure) {
      this.setResolutionDates(filing.alteration.shareStructure.resolutionDates)
      this.setShareClasses(filing.alteration.shareStructure.shareClasses)
    } else {
      // if it exists, load data from old schema
      const shareClasses = (filing.alteration as any).shareClasses
      if (shareClasses) {
        this.setShareClasses(shareClasses)
      } else {
        this.setShareClasses([])
      }
    }

    // Set Certify State
    this.setCertifyState({
      valid: false,
      certifiedBy: filing.header.certifiedBy
    })

    // Set Folio Number
    this.setFolioNumber(filing.header.folioNumber)

    // Set Filing Date
    this.setFilingDateTime(filing.header.date)

    // Set Effective Date
    this.setEffectiveDateTimeString(filing.header.effectiveDate)
    this.setIsFutureEffective(filing.header.isFutureEffective)
  }

  /**
   * Parses a business snapshot into the store.
   * @param businessSnapshot the business to be parsed
   */
  parseBusinessSnapshot (businessSnapshot: BusinessSnapshotIF[] = this.getOriginalSnapshot): void {
    if (businessSnapshot.length !== 6) throw new Error('Incomplete request responses  \'businessIdentifier\'')

    // Set original snapshot to store
    this.setOriginalSnapshot(businessSnapshot)

    // set current entity type
    this.setEntityType(businessSnapshot[0].business.legalType)

    // Set Business Information
    this.setBusinessInformation(businessSnapshot[0].business)

    // Set Name Request
    this.setNameRequest({
      legalType: businessSnapshot[0].business.legalType,
      legalName: businessSnapshot[0].business.legalName,
      foundingDate: businessSnapshot[0].business.foundingDateTime
    })

    // Set Name Translations
    this.setNameTranslations(
      businessSnapshot[1].aliases?.map(x => {
        return {
          id: x.id,
          name: x.name,
          oldName: null,
          action: null
        }
      }) || []
    )

    // Set Office Addresses
    this.setOfficeAddresses(businessSnapshot[2])

    // Set People and Roles
    this.setPeopleAndRoles(businessSnapshot[3].directors?.map(director => {
      return {
        officer: {
          firstName: director.officer.firstName,
          lastName: director.officer.lastName
        },
        mailingAddress: director.deliveryAddress,
        deliveryAddress: director.mailingAddress,
        roles: [
          {
            roleType: director.role in RoleTypes ? director.role
              : Object.values(RoleTypes).find(role => {
                if (role.toLocaleLowerCase() === director.role.toLocaleLowerCase()) {
                  return role
                }
              }),
            appointmentDate: director.appointmentDate,
            cessationDate: null
          }
        ]
      }
    }))

    // Infer type on Business snapshot shareClasses
    const businessStructure: any = businessSnapshot[4]
    const businessShareClasses: ShareStructureIF = businessStructure as ShareStructureIF
    const shareClasses: ShareClassIF[] = businessShareClasses.shareClasses as ShareClassIF[]

    // Apply a type to share classes and series
    shareClasses.forEach(shareClass => {
      shareClass.type = 'Class'
      shareClass.series.forEach(shareSeries => { shareSeries.type = 'Series' })
    })
    // // Set Share Structure
    this.setPreviousResolutionDates(businessStructure.resolutionDates)
    this.setShareClasses(shareClasses)

    // Set Contact Information
    this.setBusinessContact(businessSnapshot[5])
  }

  /**
    * Ensure consistent object structure for an incorporation application
    * whether it contains a Name Request or not, and whether it is an initial
    * draft or it has been previously saved. Object merging does not
    * work very well otherwise (due to nested properties).
    * @param filing the draft filing fetched from legal-api
    * @returns the filing in safe-empty state if applicable
  */
  formatEmptyFiling (filing: any): IncorporationFilingIF {
    let toReturn = filing
    if (toReturn.incorporationApplication) {
      // if there are no offices, populate empty array
      if (!toReturn.incorporationApplication.offices) {
        toReturn.incorporationApplication.offices = []
      }

      // if there is no contact point, populate empty object
      if (!toReturn.incorporationApplication.contactPoint) {
        toReturn.incorporationApplication.contactPoint = {
          email: '',
          phone: '',
          extension: ''
        }
      }

      // if there are no parties, populate empty array
      if (!toReturn.incorporationApplication.parties) {
        toReturn.incorporationApplication.parties = []
      }

      // if there is no share structure...
      if (!toReturn.incorporationApplication.shareStructure) {
        // if there are share classes (ie, old schema), assign them to the share structure (ie, new schema)
        if (toReturn.incorporationApplication.shareClasses) {
          toReturn.incorporationApplication.shareStructure = {
            shareClasses: toReturn.incorporationApplication.shareClasses
          }
        } else {
          // otherwise populate empty object
          toReturn.incorporationApplication.shareStructure = {
            shareClasses: []
          }
        }
      }
    }
    return toReturn
  }
}
