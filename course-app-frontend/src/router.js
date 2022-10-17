import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import ProfileView from './views/Profile.vue'
import SignInView from './views/SignIn.vue'
import SignUpView from './views/SignUp.vue'
import SignOutView from './views/SignOut.vue'
import NotesView from './views/Notes.vue'
import CreateNoteView from './views/CreateNote.vue'
import OneNoteView from './views/OneNote.vue'
import CreateCourseView from './views/CreateCourse.vue'
import CoursesView from './views/Courses.vue'
import OneCourseView from './views/OneCourse.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/:username', component: ProfileView },
        { path: '/sign-in', component: SignInView },
        { path: '/sign-up', component: SignUpView },
        { path: '/sign-out', component: SignOutView },
        { path: '/notes', component: NotesView },
        { path: '/create-note', component: CreateNoteView },
        { path: '/notes/:id', component: OneNoteView },
        { path: '/create-course', component: CreateCourseView },
        { path: '/courses', component: CoursesView },
        { path: '/courses/:id', component: OneCourseView },
    ],
})

export default router