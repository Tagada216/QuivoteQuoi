import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  css: [],
  devtools: { enabled: true },
  modules: ["@nuxt/image"],
  image: {
    domains: ["https://iwfrecgbwgjykhghnuue.supabase.co"],
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
});
