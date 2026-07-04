<template>
  <button 
    class="fixed top-8 right-8 z-[60] flex flex-col justify-between w-6 h-4 group cursor-pointer border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary rounded p-0.5"
    @click="$emit('toggle')"
    aria-label="Toggle Navigation Menu"
    :aria-expanded="isOpen"
  >
    <span 
      class="w-full h-[2px] bg-white transition-transform duration-300 origin-right"
      :class="{ '-rotate-45 translate-y-[1px] bg-primary': isOpen, 'group-hover:translate-x-[-2px]': !isOpen }"
    ></span>
    <span 
      class="w-full h-[2px] bg-white transition-opacity duration-300"
      :class="{ 'opacity-0': isOpen }"
    ></span>
    <span 
      class="w-full h-[2px] bg-white transition-transform duration-300 origin-right"
      :class="{ 'rotate-45 -translate-y-[1px] bg-primary': isOpen, 'group-hover:translate-x-[2px]': !isOpen }"
    ></span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggle'])
</script>
