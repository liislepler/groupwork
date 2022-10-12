import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import SignInView from './views/SignIn.vue'
import SignUpView from './views/SignUp.vue'
import SignOutView from './views/SignOut.vue'
import NotesView from './views/Notes.vue'
import CreateNoteView from './views/CreateNote.vue'
import OneNoteView from './views/OneNote.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/sign-in', component: SignInView },
        { path: '/sign-up', component: SignUpView },
        { path: '/sign-out', component: SignOutView },
        { path: '/notes', component: NotesView },
        { path: '/create-note', component: CreateNoteView },
        { path: '/notes/:id', component: OneNoteView },
    ],
})

export default router