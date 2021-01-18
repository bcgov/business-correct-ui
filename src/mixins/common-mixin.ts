import { Component, Vue } from 'vue-property-decorator'
import { omit, isEqual } from 'lodash'
import { EntityTypes, RouteNames } from '@/enums'

/**
 * Mixin that provides some useful common utilities.
 */
@Component({})
export default class CommonMixin extends Vue {
  /** True if Jest is running the code. */
  get isJestRunning (): boolean {
    return (process.env.JEST_WORKER_ID !== undefined)
  }

  /**
   * Compares two objects while omitting specified properties from the comparison.
   * @param objA the first object to compare
   * @param objB the second object to compare
   * @param props an optional array of properties to omit during the comparison
   * @return a boolean indicating a match of objects
   */
  isSame (objA: {}, objB: {}, props: string[] = []): boolean {
    return isEqual({ ...omit(objA, props) }, { ...omit(objB, props) })
  }

  /**
   * Scrolls the window to the top of the specified element.
   * @param element the element to scroll to the top of
   */
  scrollToTop (element: any): void {
    Vue.nextTick(() => {
      // don't call window.scrollTo during Jest tests because jsdom doesn't implement it
      if (!this.isJestRunning) window.scrollTo({ top: element.offsetTop, behavior: 'smooth' })
    })
  }

  /**
   * Returns the full (first-middle-last) name of the subject officer.
   * @param officer the object to get the names from
   * @returns the formatted full name string
   */
  formatFullName (officer: any): string {
    let fullName: string = ''
    if (officer?.firstName) fullName += officer.firstName + ' '
    if (officer?.middleName) fullName += officer.middleName + ' '
    if (officer?.lastName) fullName += officer.lastName
    return fullName.trimRight()
  }

  /**
   * Returns the full address of the subject.
   * @param addressData the object to get the address from
   * @returns the formatted full address string
   */
  formatFullAddress (addressData: any): string {
    let fullAddress: string = ''
    if (addressData?.addrLine1) fullAddress += addressData.addrLine1 + ', '
    if (addressData?.city) fullAddress += addressData.city + ', '
    if (addressData?.stateProvinceCd) fullAddress += addressData.stateProvinceCd + ', '
    if (addressData?.postalCd) fullAddress += addressData.postalCd + ', '
    if (addressData?.countryTypeCd) fullAddress += addressData.countryTypeCd

    return fullAddress.trimRight()
  }

  /** Returns true when filing a correction. */
  isCorrection (): boolean {
    return (this.$route.name === RouteNames.CORRECTION)
  }

  /** Returns true when filing an alteration. */
  isAlteration (): boolean {
    return (this.$route.name === RouteNames.ALTERATION)
  }

  /** Returns the appropriate edit label for corrections or alterations */
  get editLabel (): string {
    return this.isCorrection() ? 'Correct' : 'Change'
  }

  /** Returns the appropriate edited label for corrections or alterations */
  get editedLabel (): string {
    return this.isCorrection() ? 'Corrected' : 'Changed'
  }

  /** The entity title. */
  get entityTitle (): string {
    switch (this.$route.name) {
      case RouteNames.CORRECTION:
        return 'Correction - Incorporation Application'
      case RouteNames.ALTERATION:
        return 'Company Information'
      default:
        return ''
    }
  }

  /**
   * Get an entity type descriptor based on entity type code
   * @param entityType The entity type code
   * @returns a readable entity descriptor
   * */
  getEntityDesc (entityType: string): string {
    switch (entityType) {
      case EntityTypes.BENEFIT_COMPANY:
        return 'BC Benefit Company'
      case EntityTypes.BC_CORPORATION:
        return 'BC Limited Company'
      case EntityTypes.COOP:
        return 'BC Cooperative Association'
      default:
        return ''
    }
  }
}
