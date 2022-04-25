<template>
  <d2-container :is-back="false">
    <page-header slot="header"/>
    <page-main/>
  </d2-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'index',
  components: {
    PageHeader: () => import('./components/PageHeader'),
    PageMain: () => import('./components/PageMain')
  },
  data () {
    return {
      visible: false,
      license: undefined
    }
  },
  mounted () {
    console.log('aaaa')
  },
  methods: {
    ...mapActions('careyshop/account', [
      'logout'
    ])
  }
}
</script>
