<script setup lang="ts">
import { useClipboard, usePermission } from '@vueuse/core'

type PropsLinkButton = {
  url: string
}

const  { url } = defineProps<PropsLinkButton>()

const { text, isSupported, copy } = useClipboard()
const permissionRead = usePermission('clipboard-read')
const permissionWrite = usePermission('clipboard-write')
</script>

<template>
  <div v-if="isSupported">
    <note>
      Clipboard Permission: read <b>{{ permissionRead }}</b> | write
      <b>{{ permissionWrite }}</b>
    </note>
    <p>
      Current copied: <code>{{ text || 'none' }}</code>
    </p>
    <button @click="copy(url)">
      generate Link
    </button>
  </div>
  <p v-else>
    Your browser does not support Clipboard API
  </p>
</template>