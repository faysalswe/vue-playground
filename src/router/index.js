import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Form from "../views/Form.vue";
import Posts from "../views/Posts.vue";
import Post from "../views/Post.vue";
import NestedRoute from "../views/NestedRoute.vue";
import ScrumPoker from "../views/ScrumPoker.vue";
import CreateRoom from "../views/CreateRoom.vue";
import JoinRoom from "../views/JoinRoom.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/form",
    component: Form
  },
  {
    path: "/posts",
    component: Posts
  },
  {
    path: "/post/:id",
    component: Post
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
  },
  {
    path: "/nested",
    component: NestedRoute,
    children: [
      {
        path: ":id",
        component: Post
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
