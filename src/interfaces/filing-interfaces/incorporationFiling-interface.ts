import { IncorporationAddressIf, OrgPersonIF, ShareClassIF } from '@/interfaces'

/** Incorporation Application filing loaded from / saved to the Legal API. */
export interface IncorporationFilingIF {
  header: {
    name: string
    certifiedBy: string
    date: string
    effectiveDate?: string // Optional and should be set only for future effective filings
    filingId?: number // Optional as this is not required when building a filing - causes an error for new filings
    folioNumber?: string // Optional to the user and only displayed for certain account types
    isFutureEffective: boolean
    status?: string
  }
  business: {
    legalType: string,
    identifier: string,
  }
  incorporationApplication: {
    // NB: nameRequest must match schema
    nameRequest: {
      legalType: string
      nrNumber?: string // only set when there is an NR
      legalName?: string // only set when there is an NR
    }
    nameTranslations: {
      new: Array<string>
    }
    offices: IncorporationAddressIf | {}
    contactPoint: {
      email: string
      phone: string
      extension: string
    }
    parties: OrgPersonIF[]
    shareStructure: {
      shareClasses: ShareClassIF[]
    }
    incorporationAgreement: {
      agreementType: string
    }
  }
}
