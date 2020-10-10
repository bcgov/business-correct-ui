import { Component, Vue } from 'vue-property-decorator'
import { omit, isEqual } from 'lodash'

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
   * Compares two objects while omitting a specified property from the comparison.
   *
   * @param addressA the first object to compare
   * @param addressB the second object to compare
   * @param prop the property to omit during the comparison
   *
   * @return a boolean indicating a match of objects
   */
  isSame (objA: {}, objB: {}, prop: string = null): boolean {
    return isEqual({ ...omit(objA, prop ? [prop] : []) }, { ...omit(objB, prop ? [prop] : []) })
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
}
