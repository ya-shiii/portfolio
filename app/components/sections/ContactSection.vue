<template>
  <section class="min-h-screen w-full flex flex-col justify-center px-6 md:px-24 py-24 relative z-10">
    <div class="max-w-4xl w-full mx-auto flex flex-col items-center justify-center text-center">
      
      <div class="flex items-center gap-4 w-full mb-16 reveal-header" style="animation-delay: 0s">
        <div class="h-[1px] flex-grow bg-white/10"></div>
        <span class="font-mono text-xs tracking-widest text-primary">07 / CONTACT</span>
        <div class="h-[1px] flex-grow bg-white/10"></div>
      </div>

      <div class="flex flex-col items-center gap-4 max-w-2xl">
        <h2 class="font-sans text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight uppercase reveal-title" style="animation-delay: 0.15s">
          LET'S BUILD<br>SOMETHING USEFUL.
        </h2>

        <p class="font-sans text-xs md:text-sm text-muted mt-4 leading-relaxed reveal-desc" style="animation-delay: 0.3s">
          I'm currently open to Full Stack Developer and software development opportunities, including remote roles and teams building practical products.
        </p>

        <!-- Dynamic Interaction Connections (Contact pathways) -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-12 max-w-xl">
          <button 
            @click="isEmailModalOpen = true"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all reveal-link cursor-pointer w-full"
            style="animation-delay: 0.4s"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">EMAIL</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">INBOX</span>
          </button>

          <a 
            :href="socialLinks.linkedin"
            target="_blank"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all reveal-link"
            style="animation-delay: 0.48s"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">LINKEDIN</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">CONNECT</span>
          </a>

          <a 
            :href="socialLinks.github"
            target="_blank"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all reveal-link"
            style="animation-delay: 0.56s"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">GITHUB</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">CODEBASE</span>
          </a>

          <!-- Static Resume Trigger Path -->
          <a 
            :href="socialLinks.resume"
            target="_blank"
            class="bg-surface/20 hover:bg-surface/50 border border-white/5 hover:border-primary/40 rounded p-4 flex flex-col items-center gap-2 group transition-all reveal-link"
            style="animation-delay: 0.64s"
          >
            <span class="font-mono text-[9px] text-white/40 group-hover:text-primary tracking-widest uppercase">RESUME</span>
            <span class="font-mono text-[10px] text-white font-medium group-hover:text-white transition-colors">PDF FILE</span>
          </a>
        </div>
      </div>

    </div>

    <!-- Email Modal Overlay -->
    <div 
      v-if="isEmailModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
      @click.self="closeModal"
    >
      <div class="relative w-full max-w-md bg-[#0a0a14] border border-primary/30 rounded-lg shadow-[0_0_40px_rgba(160,32,240,0.15)] overflow-hidden flex flex-col pointer-events-auto">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
          <div class="flex flex-col">
            <span class="font-mono text-[10px] text-primary tracking-widest uppercase font-bold">SECURE TRANSMISSION</span>
            <span class="font-mono text-[8px] text-white/40 tracking-wider">DIRECT TO INBOX</span>
          </div>
          <button @click="closeModal" class="text-white/40 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>

        <!-- Form Area -->
        <div class="p-6 flex flex-col gap-5">
          <div v-if="formStatus === 'success'" class="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div class="w-12 h-12 rounded-full border border-green-500/30 flex items-center justify-center bg-green-500/10 mb-2">
              <span class="text-green-400 text-xl">✓</span>
            </div>
            <span class="font-mono text-sm text-green-400 tracking-wider">TRANSMISSION COMPLETE</span>
            <p class="font-sans text-xs text-white/50">Your message has been securely delivered to my inbox. I will review it shortly.</p>
            <button @click="closeModal" class="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 font-mono text-[10px] text-white tracking-widest uppercase rounded border border-white/10 transition-colors">
              CLOSE TERMINAL
            </button>
          </div>

          <form v-else @submit.prevent="submitForm" class="flex flex-col gap-4 text-left">
            <!-- Web3Forms Honeypot Spam Protection -->
            <input type="checkbox" name="botcheck" class="hidden" style="display: none;" v-model="formData.botcheck">

            <div class="flex flex-col gap-1.5">
              <label class="font-mono text-[9px] text-white/50 tracking-widest uppercase">IDENTIFICATION (NAME)</label>
              <input 
                v-model="formData.name"
                type="text" 
                required
                class="bg-black/50 border border-white/10 focus:border-primary/50 rounded px-3 py-2.5 text-sm font-sans text-white outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-mono text-[9px] text-white/50 tracking-widest uppercase">RETURN PROTOCOL (EMAIL)</label>
              <input 
                v-model="formData.email"
                type="email" 
                required
                class="bg-black/50 border border-white/10 focus:border-primary/50 rounded px-3 py-2.5 text-sm font-sans text-white outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="font-mono text-[9px] text-white/50 tracking-widest uppercase">PAYLOAD (MESSAGE)</label>
              <textarea 
                v-model="formData.message"
                required
                rows="4"
                class="bg-black/50 border border-white/10 focus:border-primary/50 rounded px-3 py-2.5 text-sm font-sans text-white outline-none transition-colors resize-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <div v-if="formStatus === 'error'" class="font-mono text-[9px] text-red-400 tracking-wider border border-red-500/20 bg-red-500/10 p-2 rounded text-center">
              TRANSMISSION FAILED. PLEASE TRY AGAIN.
            </div>

            <button 
              type="submit" 
              :disabled="formStatus === 'submitting'"
              class="mt-2 w-full bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary hover:text-white font-mono text-[10px] tracking-widest uppercase py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <div v-if="formStatus === 'submitting'" class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>{{ formStatus === 'submitting' ? 'TRANSMITTING...' : 'INITIATE TRANSFER' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePortfolioContent } from '~/composables/usePortfolioContent'

defineProps<{ isActive: boolean }>()

const { getPortfolio } = usePortfolioContent()
const { socialLinks } = getPortfolio()

// Modal State
const isEmailModalOpen = ref(false)
const formStatus = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')

const formData = ref({
  name: '',
  email: '',
  message: '',
  botcheck: false
})

const closeModal = () => {
  isEmailModalOpen.value = false
  setTimeout(() => {
    formStatus.value = 'idle'
    formData.value = { name: '', email: '', message: '', botcheck: false }
  }, 300)
}

const WEB3FORMS_ACCESS_KEY = '53f7e199-9f71-4898-9b6d-055c435fd0dc'

const submitForm = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) return
  
  formStatus.value = 'submitting'

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.value.name,
        email: formData.value.email,
        message: formData.value.message,
        botcheck: formData.value.botcheck,
        subject: `New Portfolio Message from ${formData.value.name}`
      })
    })

    const result = await response.json()
    if (response.status === 200) {
      formStatus.value = 'success'
    } else {
      console.error('Web3Forms Error:', result)
      formStatus.value = 'error'
    }
  } catch (error) {
    console.error('Submit Error:', error)
    formStatus.value = 'error'
  }
}
</script>

<style scoped>
.reveal-header {
  opacity: 0;
  transform: scaleX(0.8);
  animation: headerIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.reveal-title {
  opacity: 0;
  transform: translateY(20px);
  animation: titleIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.reveal-desc {
  opacity: 0;
  transform: translateY(15px);
  animation: descIn 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.reveal-link {
  opacity: 0;
  transform: translateY(15px);
  animation: linkIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes headerIn {
  to { opacity: 1; transform: scaleX(1); }
}

@keyframes titleIn {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes descIn {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes linkIn {
  to { opacity: 1; transform: translateY(0); }
}
</style>
