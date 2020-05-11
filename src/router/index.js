import Vue from "vue";
import VueRouter from "vue-router";
import ScrumPoker from "../views/ScrumPoker.vue";
import CreateRoom from "../views/CreateRoom.vue";
import JoinRoom from "../views/JoinRoom.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/create-room"
  },
  {
    path: "/create-room",
    component: CreateRoom
  },
  {
    path: "/join-room/:roomId",
    component: JoinRoom
  },
  {
    path: "/scrum-poker/:roomId/:userId",
    component: ScrumPoker
  }
];

const router = new VueRouter({
  routes
});

export default router;
