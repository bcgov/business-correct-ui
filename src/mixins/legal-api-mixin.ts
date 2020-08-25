// Libraries
import { Component, Vue } from 'vue-property-decorator'
import { State, Action, Getter } from 'vuex-class'
import { NOT_FOUND } from 'http-status-codes'
import { axios } from '@/utils'

// Interfaces
import { StateModelIF, ActionBindingIF, GetterIF, IncorporationFilingIF } from '@/interfaces'

/**
 * Mixin that provides the integration with the legal api.
 */
@Component({})
export default class LegalApiMixin extends Vue {
  readonly NAME_REQUEST = 'nameRequest'
  readonly INCORPORATION_APPLICATION = 'incorporationApplication'

  // Global state
  @State stateModel!: StateModelIF

  // Global Getters
  @Getter isTypeBcomp!: GetterIF
  @Getter getFilingId!: number
  @Getter getTempId!: string

  // Store Actions
  @Action setNameRequestState!: ActionBindingIF
  @Action setFilingId!: ActionBindingIF

  /**
   * Saves a filing.
   * @param isDraft boolean indicating whether to complete filing
   * @param filing filing body to be saved
   * @returns a promise to return the saved filing
   */
  async saveFiling (filing: IncorporationFilingIF, isDraft: boolean): Promise<any> {
    if (!filing) throw new Error('Invalid parameter \'filing\'')
    if (typeof isDraft !== 'boolean') throw new Error('Invalid parameter \'isDraft\'')

    // if we have a Filing ID, update an existing filing
    if (this.getFilingId && this.getFilingId > 0) {
      return this.updateFiling(filing, isDraft)
    } else {
      // This should never happen. Filing Id should always be present
      throw new Error('Invalid filing Id')
    }
  }

  /**
   * Fetches a draft filing.
   * @returns a promise to return the draft filing, or null if not found
   */
  async fetchDraft (): Promise<any> {
    // get the draft filing from the tasks endpoint
    const url = `businesses/${this.getTempId}/filings`
    return axios.get(url)
      .then(response => {
        // look at only the first task
        const filing = response?.data?.filing
        const filingName = filing?.header?.name
        const filingId = +filing?.header?.filingId // may be NaN

        if (!filing || filingName !== this.INCORPORATION_APPLICATION || !filingId) {
          throw new Error('Invalid API response')
        }
        // save Filing ID from the header
        this.setFilingId(filingId)
        return this.formatEmptyFiling(filing)
      })
      .catch((error) => {
        if (error?.response?.status === NOT_FOUND) {
          return null // IA not found
        }
        throw error
      })
  }

  /**
   * Fetches a filing.
   * @returns a promise to return the filing of the specified type, or null if not found
   */
  async fetchFiling (businessId: string, filingType: string): Promise<IncorporationFilingIF> {
    const url = `businesses/${businessId}/filings`
    return axios.get(url)
      .then(response => {
        const filings = response?.data?.filings
        const returnfiling = filings.find(filings => filings.filing.header.name === filingType)

        if (!filings || !returnfiling) {
          throw new Error('Invalid API response')
        }
        return returnfiling
      })
      .catch((error) => {
        if (error?.response?.status === NOT_FOUND) {
          throw error // IA not found
        }
      })
  }

  /**
   * Updates an existing filing.
   * @param data the object body of the request
   * @param isDraft boolean indicating whether to save draft or complete filing
   * @returns a promise to return the updated filing
   */
  private updateFiling (filing: IncorporationFilingIF, isDraft: boolean): Promise<any> {
    // put updated filing to filings endpoint
    let url = `businesses/${this.getTempId}/filings/${this.getFilingId}`
    if (isDraft) {
      url += '?draft=true'
    }

    return axios.put(url, filing).then(response => {
      const filing = response?.data?.filing
      const filingId = +filing?.header?.filingId
      if (!filing || !filingId) {
        throw new Error('Invalid API response')
      }
      return filing
    })
  }

  /**
   * Fetches authorizations.
   * @param businessIdentifier the business identifier (eg, BC1219948)
   * @returns a promise to return the authorizations object
   */
  getAuthorizations (businessIdentifier: string): Promise<any> {
    if (!businessIdentifier) throw new Error('Invalid parameter \'businessIdentifier\'')

    const url = `entities/${businessIdentifier}/authorizations`
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }
    return axios.get(url, config)
  }

  /**
   * Fetches current user data.
   * @returns a promise to return the user data
   */
  getCurrentUser (): Promise<any> {
    const authUrl = sessionStorage.getItem('AUTH_API_URL')
    const config = { baseURL: authUrl }
    return axios.get('users/@me', config)
  }

  /**
   * Fetches name request data.
   * @param nrNumber the name request number (eg, NR 1234567)
   * @returns a promise to return the NR data, or null if not found
   */
  fetchNameRequest (nrNumber: string): Promise<any> {
    if (!nrNumber) throw new Error('Invalid parameter \'nrNumber\'')

    const url = `nameRequests/${nrNumber}`
    return axios.get(url)
      .then(response => {
        const data = response?.data
        if (!data) {
          throw new Error('Invalid API response')
        }
        return data
      }).catch(error => {
        if (error?.response?.status === NOT_FOUND) {
          return null // NR not found
        }
        throw error
      })
  }

  /**
    * Ensure consisent object structure for an incorporation application
    * whether it contains a Name Request or not, and whether it is an initial
    * draft or it has been previously saved. Object merging does not
    * work very well otherwise (due to nested properties)
    * @param filing The filing fetched from legal-api
    * @returns the filing in safe-empty state if applicable
  */
  formatEmptyFiling (filing: any): IncorporationFilingIF {
    let toReturn = filing
    if (toReturn.incorporationApplication) {
      if (!toReturn.incorporationApplication?.offices) {
        toReturn.incorporationApplication.offices = []
      }
      if (!toReturn.incorporationApplication?.contactPoint) {
        toReturn.incorporationApplication.contactPoint = {
          email: '',
          phone: '',
          extension: ''
        }
      }
      if (!toReturn.incorporationApplication?.parties) {
        toReturn.incorporationApplication.parties = []
      }
      if (!toReturn.incorporationApplication?.shareClasses) {
        toReturn.incorporationApplication.shareClasses = []
      }
    }
    return toReturn
  }
}
