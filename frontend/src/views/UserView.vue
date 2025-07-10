<script setup lang="ts">
import BookRequestCard from '@/components/user/BookRequestCard.vue'
import UserAccountCard from '@/components/user/UserAccountCard.vue'
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="flex flex-wrap gap-4 justify-center max-w-5xl mx-auto">
      <div class="flex-1 min-w-[280px] max-w-[400px]">
        <BookRequestCard />
      </div>
       <div class="flex-1 min-w-[280px] max-w-[400px]">
        <UserAccountCard />
      </div>
    </div>
  </div>
</template>