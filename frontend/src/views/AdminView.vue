<script setup lang="ts">
import ActionCard from '@/components/admin/ActionCard.vue'
import AdminUserCard from '@/components/admin/AdminUserCard.vue'
import BookRequestAdminCard from '@/components/admin/BookRequestAdminCard.vue'
import AdminLibraryCard from '@/components/admin/AdminLibraryCard.vue'
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex flex-wrap gap-4 justify-center max-w-5xl mx-auto">
      <div class="flex-1 min-w-[280px] max-w-[400px]">
        <ActionCard />
      </div>
      <div class="flex-1 min-w-[280px] max-w-[400px]">
        <AdminUserCard />
      </div>
      <div class="flex-1 min-w-[280px] max-w-[400px]">
        <BookRequestAdminCard />
      </div>
      <div class="flex-1 min-w-[280px] max-w-[400px]">
  <AdminLibraryCard />
</div>
    </div>
  </div>
</template>