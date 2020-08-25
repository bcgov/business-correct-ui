// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// State
import { stateModel, resourceModel } from './state'

// Getters
import {
  isRoleStaff, isAuthEdit, isAuthView, isEntityType, isPremiumAccount, isTypeBcomp, isTypeCoop,
  isShowBackBtn, isShowReviewConfirmBtn, isShowFilePayBtn, isEnableFilePayBtn, isBusySaving,
  getFilingId, getTempId, isNamedBusiness, getNameRequestNumber, getApprovedName, getAccountId,
  getFolioNumber, getNameRequestDetails, getNameRequestApplicant, getOfficeAddresses,
  isApplicationValid, getSteps, getMaxStep, getCurrentDate, ignoreChanges, haveChanges, getNameTranslations
} from '@/store/getters'

// Mutations
import {
  mutateCurrentStep, mutateIsSaving, mutateIsSavingResuming, mutateIsFilingPaying,
  mutateKeycloakRoles, mutateAuthRoles, mutateUserEmail, mutateCurrentDate, mutateFolioNumber,
  mutateCertifyStatementResource, mutateCertifyState, mutateBusinessContact, mutateDefineCompanyStepValidity,
  mutateAccountInformation, mutateNameRequestState, mutateFilingId, mutateOfficeAddresses, mutateOrgPersonList,
  mutateAddPeopleAndRoleStepValidity, mutateShareClasses, mutateCreateShareStructureStepValidity,
  mutateIgnoreChanges, mutateHaveChanges, mutateIsFutureEffective, mutateEffectiveDate,
  mutateIsIncorporationDateTimeValid, mutateTempId, mutateEntityType, mutateIncorporationAgreementStepData,
  mutateNameTranslation, mutateBusinessInformation
} from '@/store/mutations'

// Actions
import {
  setCurrentStep, setIsSaving, setIsSavingResuming, setIsFilingPaying,
  setKeycloakRoles, setAuthRoles, setUserEmail, setCurrentDate, setCertifyStatementResource, setCertifyState,
  setBusinessContact, setDefineCompanyStepValidity, setNameRequestState, setFilingId, setFolioNumber,
  setOfficeAddresses, setOrgPersonList, setAddPeopleAndRoleStepValidity, setShareClasses,
  setCreateShareStructureStepValidity, setIgnoreChanges, setHaveChanges, setIsFutureEffective,
  setEffectiveDate, setIsIncorporationDateTimeValid, setAccountInformation, setTempId, setEntityType,
  setIncorporationAgreementStepData, setNameTranslationState, setBusinessInformation
} from './actions'

/**
 * Configures and returns Vuex Store.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  const store = new Vuex.Store<any>({
    state: {
      stateModel,
      resourceModel
    },
    getters: {
      isRoleStaff,
      isAuthEdit,
      isAuthView,
      isEntityType,
      isTypeBcomp,
      isTypeCoop,
      isShowBackBtn,
      isShowReviewConfirmBtn,
      isShowFilePayBtn,
      isEnableFilePayBtn,
      isBusySaving,
      isPremiumAccount,
      getAccountId,
      isNamedBusiness,
      getNameRequestNumber,
      getApprovedName,
      getTempId,
      getFilingId,
      getFolioNumber,
      getNameRequestApplicant,
      getNameRequestDetails,
      getOfficeAddresses,
      isApplicationValid,
      getSteps,
      getMaxStep,
      getCurrentDate,
      ignoreChanges,
      haveChanges,
      getNameTranslations
    },
    mutations: {
      mutateAccountInformation,
      mutateBusinessInformation,
      mutateCurrentStep,
      mutateIsSaving,
      mutateIsSavingResuming,
      mutateIsFilingPaying,
      mutateKeycloakRoles,
      mutateAuthRoles,
      mutateUserEmail,
      mutateCurrentDate,
      mutateCertifyStatementResource,
      mutateCertifyState,
      mutateBusinessContact,
      mutateDefineCompanyStepValidity,
      mutateNameRequestState,
      mutateFilingId,
      mutateFolioNumber,
      mutateOfficeAddresses,
      mutateOrgPersonList,
      mutateAddPeopleAndRoleStepValidity,
      mutateShareClasses,
      mutateCreateShareStructureStepValidity,
      mutateIgnoreChanges,
      mutateHaveChanges,
      mutateIsFutureEffective,
      mutateEffectiveDate,
      mutateIsIncorporationDateTimeValid,
      mutateTempId,
      mutateEntityType,
      mutateIncorporationAgreementStepData,
      mutateNameTranslation
    },
    actions: {
      setAccountInformation,
      setBusinessInformation,
      setCurrentStep,
      setIsSaving,
      setIsSavingResuming,
      setIsFilingPaying,
      setKeycloakRoles,
      setAuthRoles,
      setUserEmail,
      setCurrentDate,
      setCertifyStatementResource,
      setCertifyState,
      setBusinessContact,
      setDefineCompanyStepValidity,
      setNameRequestState,
      setFilingId,
      setFolioNumber,
      setOfficeAddresses,
      setOrgPersonList,
      setAddPeopleAndRoleStepValidity,
      setShareClasses,
      setCreateShareStructureStepValidity,
      setIgnoreChanges,
      setHaveChanges,
      setIsFutureEffective,
      setEffectiveDate,
      setIsIncorporationDateTimeValid,
      setTempId,
      setEntityType,
      setIncorporationAgreementStepData,
      setNameTranslationState
    }
  })

  return store
}
