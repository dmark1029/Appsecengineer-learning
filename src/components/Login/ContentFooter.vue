<template>
  <div class="row">
    <div class="col-xs-12 col-sm-6 col-md-6 portal_sm" style="padding-left: 12px">
      <p class="text-caption text-weight-regular ase-white-shade">Copyright &copy; AppSecEngineer {{ new Date().getFullYear() }}</p>
    </div>
    <div class="col-xs-12 col-sm-3 col-md-3 portal_sm text-right">
      <a
        href="https://www.appsecengineer.com/privacy-policy"
        target="_blank"
        style="color: #ffffff; text-decoration: none"
        class="ase-sm ase-sm-bold text-weight-bold"
      >
        Privacy Policy
      </a>
    </div>
    <div class="col-xs-12 col-sm-3 col-md-3 red portal_sm text-right">
      <a
        href="https://assets.appsecengineer.com/Terms%20of%20Use.pdf"
        target="_blank"
        style="color: #ffffff; text-decoration: none"
        class="ase-sm ase-sm-bold text-weight-bold"
      >
        Terms of Use
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoginContent',
  methods: {
    showPrivacyDocs() {
      const url = 'https://www.appsecengineer.com/privacy-policy'
      window.open(url, '_blank')
    },
    showTermsDocs() {
      const url = 'https://assets.appsecengineer.com/Terms%20of%20Use.pdf'
      window.open(url, '_blank')
    }
  }
}
</script>
