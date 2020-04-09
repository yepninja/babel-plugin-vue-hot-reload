import Vue from 'vue'

import { Component } from 'vue-property-decorator'

@Component
export default class Logo extends Vue {
  render1() {
    return (
      <div class="VueToNuxtLogo">
        <div class="Triangle Triangle--one" />
      </div>
    )
  }
}
