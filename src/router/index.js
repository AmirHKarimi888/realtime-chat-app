import HomeView from '@/pages/HomeView.vue'
import SignInView from '@/pages/SignInView.vue'
import SignUpView from '@/pages/SignUpView.vue'
import httpService from '@/server'
import { useUsersStore } from '@/stores/useUsersStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "Home", component: HomeView, meta: { requiresAuth: true } },
    { path: "/signup", name: "SignUp", component: SignUpView },
    { path: "/signin", name: "SignIn", component: SignInView },
  ],
})

router.beforeEach(async (to, from, next) => {
  const usersStore = useUsersStore()

  // if signedInUser is empty, try fetching from backend
  if (!usersStore.signedInUser) {
    try {
      const res = await httpService.get("users/me")
      usersStore.signedInUser = res.data
    } catch {
      usersStore.signedInUser = ""
    }
  }

  // protect routes requiring auth
  if (to.meta.requiresAuth && !usersStore.signedInUser) {
    return next({ name: 'SignIn' })
  }

  // redirect logged-in users away from login/signup pages
  if ((to.name === 'SignIn' || to.name === 'SignUp') && usersStore.signedInUser) {
    return next({ name: 'Home' })
  }

  next()
})


export default router
