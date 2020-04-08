import Vue from 'vue'

import { Component } from 'vue-property-decorator'

import './Logo.css'

@Component
export default class Logo extends Vue {
// export default {
  render() {
    return (
      <div class="VueToNuxtLogo">
        <div class="Triangle Triangle--one" />
        <div class="Triangle Triangle--two" />
        <div class="Triangle Triangle--one" />
        <div class="Triangle Triangle--three" />
        <div class="Triangle Triangle--four" />
      </div>
    )
  }
}
