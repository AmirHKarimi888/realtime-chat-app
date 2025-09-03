import HomeView from '@/pages/HomeView.vue'
import SignInView from '@/pages/SignInView.vue'
import SignUpView from '@/pages/SignUpView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Home", component: HomeView },
    { path: "/signup", name: "SignUp", component: SignUpView },
    { path: "/signin", name: "SignIn", component: SignInView },
  ],
})

export default router
