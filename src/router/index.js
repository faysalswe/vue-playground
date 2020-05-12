import Vue from "vue";
import VueRouter from "vue-router";
import ScrumPoker from "../views/ScrumPoker.vue";
import NewUser from "../views/NewUser.vue";
import RoomNotFound from "../views/RoomNotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: NewUser
  },
  {
    path: "/room-not-found",
    component: RoomNotFound
  },
  {
    path: "/:roomId",
    component: NewUser
  },
  {
    path: "/:roomId/:userId",
    component: ScrumPoker
  }
];

const router = new VueRouter({
  routes
});

export default router;
