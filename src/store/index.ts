// Libraries
import Vue from 'vue'
import Vuex from 'vuex'

// Store modules
import * as States from './state'
import * as Getters from './getters'
import * as Mutations from './mutations'
import * as Actions from './actions'

/**
 * Configures and returns Vuex Store.
 */
export function getVuexStore () {
  Vue.use(Vuex)

  const store = new Vuex.Store<any>({
    state: { ...States },
    getters: { ...Getters },
    mutations: { ...Mutations },
    actions: { ...Actions }
  })

  return store
}
