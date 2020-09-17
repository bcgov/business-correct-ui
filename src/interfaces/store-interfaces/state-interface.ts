import {
  AccountInformationIF, CertifyIF, DefineCompanyIF, NameRequestIF, TombStoneIF, PeopleAndRoleIF,
  ShareStructureIF, DateTimeIF, IncorporationAgreementIF, BusinessInformationIF, IncorporationFilingIF
} from '@/interfaces'
import { StaffPaymentIF } from '@bcrs-shared-components/interfaces'

// State model example
export interface StateModelIF {
  tombstone: TombStoneIF
  accountInformation: AccountInformationIF
  businessInformation: BusinessInformationIF,
  nameRequest: NameRequestIF
  nameTranslations: Array<string>
  certifyState: CertifyIF
  defineCompanyStep: DefineCompanyIF
  addPeopleAndRoleStep: PeopleAndRoleIF
  createShareStructureStep: ShareStructureIF
  incorporationAgreementStep: IncorporationAgreementIF
  incorporationDateTime: DateTimeIF,
  originalIA: IncorporationFilingIF,
  staffPayment: StaffPaymentIF
}
