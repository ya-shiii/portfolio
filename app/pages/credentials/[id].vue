<template>
  <main class="min-h-screen w-full bg-background text-white font-sans relative overflow-x-hidden flex flex-col p-6 md:p-16 gap-12">
    <GlobalNetwork />

    <!-- Top Navigation -->
    <div class="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between">
      <button
        class="flex items-center gap-2 font-mono text-xs tracking-widest text-primary hover:text-white transition-colors duration-300 group cursor-pointer bg-transparent border-none outline-none"
        @click="goBack"
      >
        <span class="transform group-hover:-translate-x-1.5 transition-transform duration-300">←</span>
        <span>RETURN TO CORE</span>
      </button>
      <span class="hidden md:inline font-mono text-[9px] text-white/30 tracking-[0.2em] uppercase">
        SPEAKING & COMMUNITY RECORD
      </span>
    </div>

    <!-- Main Editorial Blog Style layout -->
    <div v-if="talk" class="relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-10 credential-enter">
      
      <!-- Article Header -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-3">
          <span class="font-mono text-[10px] tracking-widest text-primary font-bold uppercase bg-primary/10 px-2 py-0.5 border border-primary/20 rounded">
            {{ talk.role }}
          </span>
          <span class="text-white/30 font-mono text-[10px]">&middot;</span>
          <span class="font-mono text-[10px] text-white/50 tracking-wider">
            {{ talk.date }}
          </span>
        </div>

        <h1 class="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
          {{ talk.topic }}
        </h1>
        
        <p class="font-mono text-[11px] text-white/40 tracking-wide uppercase">
          {{ talk.event }} &middot; {{ talk.location }}
        </p>
      </div>

      <!-- Featured Certificate & Image Gallery Carousel/Block -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        <!-- Main Article Text Content (Blog Style) -->
        <div class="col-span-12 md:col-span-7 flex flex-col gap-6 text-muted text-sm leading-relaxed whitespace-pre-line">
          <p class="text-white/80 text-base leading-relaxed font-medium">
            {{ talk.description }}
          </p>
          
          <div class="border-t border-white/5 pt-6 mt-4 flex flex-col gap-4 font-mono text-[11px] text-white/40">
            <div><span class="text-primary/70">ORGANIZATION: </span>{{ talk.organization }}</div>
            <div><span class="text-primary/70">VERIFICATION ID: </span>{{ talk.id.toUpperCase() }}</div>
            <div><span class="text-primary/70">HASH STATE: </span>{{ checksum }}</div>
          </div>
        </div>

        <!-- Right Side: Certificate Showcase & Event Images -->
        <div class="col-span-12 md:col-span-5 flex flex-col gap-6">
          
          <!-- Primary Certificate Featured Image -->
          <div v-if="talk.certificateImage && !certImageError" class="relative group w-full">
            <div class="absolute -inset-1 rounded bg-primary/15 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            <div class="relative rounded overflow-hidden border border-primary/20 bg-surface">
              <img
                :src="talk.certificateImage"
                :alt="`Certificate – ${talk.event}`"
                class="w-full h-auto object-contain"
                @error="certImageError = true"
              />
              <div class="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                <span class="font-mono text-[8px] text-primary tracking-widest uppercase font-semibold">CERTIFICATE RECORD</span>
              </div>
            </div>
          </div>

          <!-- Certificate placeholder in case of missing asset -->
          <div v-else-if="talk.certificateImage && certImageError" class="w-full rounded border border-dashed border-white/10 bg-white/[0.01] p-6 flex flex-col items-center justify-center gap-3 text-center">
            <span class="font-mono text-[9px] text-white/30 tracking-widest uppercase">CERTIFICATE FILE AWAITING UPLOAD</span>
            <span class="font-mono text-[8px] text-white/15">{{ talk.id }}/certificate.jpg</span>
          </div>

        </div>
      </div>

      <!-- Event Snapshots Gallery Grid -->
      <div v-if="talk.images && talk.images.length" class="flex flex-col gap-6 mt-4 border-t border-white/5 pt-10">
        <span class="font-mono text-[10px] text-primary tracking-widest uppercase">// EVENT SNAPSHOTS</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div 
            v-for="(img, idx) in talk.images" 
            :key="idx"
            class="relative aspect-[4/3] rounded overflow-hidden border border-white/5 hover:border-primary/40 transition-all bg-surface group cursor-pointer"
            @click="selectedImage = img"
          >
            <img 
              :src="img" 
              :alt="`${talk.event} photo ${idx + 1}`" 
              class="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-100"
              @error="(e: Event) => ((e.target as HTMLImageElement).parentElement!.style.display = 'none')"
            />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span class="font-mono text-[10px] text-white tracking-widest bg-black/50 px-3 py-1 rounded backdrop-blur-sm">ENLARGE</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Not Found -->
    <div v-else class="relative z-10 flex-1 flex items-center justify-center">
      <p class="text-red-400 font-mono tracking-widest">RECORD NOT RECOVERED</p>
    </div>

    <!-- Footer Bar -->
    <div class="relative z-10 w-full max-w-4xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 select-none">
      <div>STATUS: SECURE GATEWAY // PROTOCOL_PORT: 443</div>
      <div>&copy; {{ new Date().getFullYear() }} JOSHUA VICENTE. ALL RIGHTS RESERVED.</div>
    </div>

    <!-- Image Modal -->
    <div 
      v-if="selectedImage"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 md:p-12 backdrop-blur-md cursor-zoom-out"
      @click="selectedImage = null"
    >
      <div class="relative max-w-7xl max-h-full flex items-center justify-center">
        <button 
          class="absolute -top-12 right-0 text-white/50 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
          @click.stop="selectedImage = null"
        >
          [ CLOSE ]
        </button>
        <img 
          :src="selectedImage" 
          alt="Enlarged snapshot" 
          class="max-w-full max-h-[85vh] object-contain rounded border border-white/10 shadow-2xl"
          @click.stop
        />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePortfolioContent } from '~/composables/usePortfolioContent'
import GlobalNetwork from '~/components/global/GlobalNetwork.vue'

definePageMeta({
  pageTransition: { name: 'system-fade', mode: 'out-in' }
})

const route = useRoute()
const router = useRouter()
const { getPortfolio } = usePortfolioContent()
const { speaking } = getPortfolio()

const talk = computed(() => speaking.find(t => t.id === route.params.id))
const certImageError = ref(false)
const selectedImage = ref<string | null>(null)

const goBack = () => {
  navigateTo('/#beyond-code')
}

const checksum = computed(() => {
  if (!talk.value) return '0x00000000'
  const str = talk.value.id + talk.value.event + talk.value.date
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return '0x' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')
})

useHead({
  title: talk.value ? `${talk.value.topic} | Credential Verification` : 'Credential Verification'
})
</script>

<style scoped>
.credential-enter {
  opacity: 0;
  transform: translateY(15px);
  animation: credIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes credIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
