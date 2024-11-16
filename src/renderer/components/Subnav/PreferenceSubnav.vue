<template>
  <nav class="subnav-inner">
    <!-- 设置页面标题和返回按钮 -->
    <h3 class="la-vertical-center-layout"><div class="la-menu-button" @click="navPage('/task')"><mo-icon name='la-menu-back' width="20" height="20" /></div><span>{{ title }}</span></h3>
    <ul>
      <li
        @click="() => nav('basic')"
        :class="[ current === 'basic' ? 'active' : '' ]"
        >
        <i class="subnav-icon">
          <mo-icon name='preference-basic' width="20" height="20" />
        </i>
        <span>{{ $t('preferences.basic') }}</span>
      </li>
      <li
        @click="() => nav('advanced')"
        :class="[ current === 'advanced' ? 'active' : '' ]"
        >
        <i class="subnav-icon">
          <mo-icon name='preference-advanced' width="20" height="20" />
        </i>
        <span>{{ $t('preferences.advanced') }}</span>
      </li>
      <li
        @click="() => nav('lab')"
        :class="[ current === 'lab' ? 'active' : '' ]"
        >
        <i class="subnav-icon">
          <mo-icon name='preference-lab' width="20" height="20" />
        </i>
        <span>{{ $t('preferences.lab') }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
  import '@/components/Icons/preference-basic'
  import '@/components/Icons/preference-advanced'
  import '@/components/Icons/preference-lab'
  import '@/components/Icons/la-menu-back'

  export default {
    name: 'mo-preference-subnav',
    props: {
      current: {
        type: String,
        default: 'basic'
      }
    },
    computed: {
      title () {
        return this.$t('subnav.preferences')
      }
    },
    methods: {
      navPage (page) {
        this.$router.push({
          path: page
        }).catch(err => {
          console.log(err)
        })
      },
      nav (category = 'basic') {
        this.$router.push({
          path: `/preference/${category}`
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>
