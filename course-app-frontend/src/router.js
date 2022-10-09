import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import SignInView from './views/SignIn.vue'
import SignUpView from './views/SignUp.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/sign-in', component: SignInView },
        { path: '/sign-up', component: SignUpView },
    ],
})

export default router