import './style.css'
import App from './App.vue'
import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"

import Home from "./components/Home.vue"
import Login from "./components/Login.vue"
import SignUp from "./components/SignUp.vue"
import CreateVote from "./components/CreateVote.vue"
import CreatePoll from "./components/CreatePoll.vue"
import PollDetail from "./components/PollDetail.vue"

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/signup", component: SignUp },
    { path: "/create-vote", component: CreateVote },
    { path: "/create-poll", component: CreatePoll },
    { path: "/poll/:id", name: "PollDetail", component: PollDetail }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).mount("#app")