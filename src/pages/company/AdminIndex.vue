<template>
  <div class="viewPages">
    <div class="text-subtitle1">Administrators</div>
    <CompanyAdminOpsTable />
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import CompanyAdminOpsTable from 'components/company/CompanyAdminOpsTable.vue'
export default defineComponent({
  name: 'CompanyAdminOps',
  components: { CompanyAdminOpsTable }
})
</script>
