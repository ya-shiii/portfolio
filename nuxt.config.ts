// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },
  ssr: true,
  nitro: {
    preset: 'github-pages',
    prerender: {
      routes: [
        '/',
        '/projects/aptitude',
        '/projects/kathies-kitchen',
        '/projects/delgar',
        '/projects/techsavvy',
        '/credentials/nmsc-tech-seminar-2026',
        '/credentials/wtm-zamboanga-2026',
        '/credentials/tcnhs-career-guidance-2025',
      ]
    }
  },
  app: {
    baseURL: '/portfolio/',
    pageTransition: { name: 'system-fade', mode: 'out-in' },
    head: {
      title: 'Joshua Vicente | Full Stack Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Full Stack Developer building production web applications, business platforms, e-commerce systems, and digital products using Django, Nuxt.js, Vue.js, and PostgreSQL.' },
        { name: 'og:title', content: 'Joshua Vicente | Full Stack Developer' },
        { name: 'og:description', content: 'Full Stack Developer building production web applications, business platforms, e-commerce systems, and digital products.' },
        { name: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  css: [
    '~/assets/css/main.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: false
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['node']
      }
    }
  }
})
