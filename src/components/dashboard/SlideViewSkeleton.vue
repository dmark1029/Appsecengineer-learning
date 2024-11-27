<template>
  <div class="full-height">
    <BaseCard class="full-height flex text-subtitle1 cursor-pointer q-pt-md q-px-sm q-pb-sm">
      <div class="full-width content-wrapper">
        <div class="row justify-end q-mb-sm full-width">
          <q-skeleton type="circle" size="30px" />
        </div>
        <q-card-section class="q-pa-none col-2">
          <q-skeleton width="100%" height="150px" square style="border-radius: 8px" />
        </q-card-section>

        <q-card-section class="full-width self-end q-pa-none q-mt-sm">
          <q-skeleton type="text" style="border-radius: 8px" />
          <q-skeleton type="text" width="50%" style="border-radius: 8px" />
        </q-card-section>

        <q-card-section class="full-width q-pa-none ma-auto q-mt-md">
          <q-skeleton type="text" height="12px" style="border-radius: 8px" />
          <div class="row justify-between items-center">
            <q-skeleton type="text" width="30%" style="border-radius: 8px" />
            <q-skeleton type="text" width="30%" style="border-radius: 8px" />
          </div>
        </q-card-section>
      </div>
    </BaseCard>
  </div>
</template>
