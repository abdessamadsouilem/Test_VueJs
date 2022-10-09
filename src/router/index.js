import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CreateBlog from "../views/CreateBlog.vue";
import Blog from "../views/Blog.vue";
import EditBlog from "../views/EditBlog.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create",
    name: "CreateBlog",
    component: CreateBlog,
  },
  {
    path: "/blog/:id",
    name: "Blog",
    component: Blog,
  },
  {
    path: "/edit/:id",
    name: "EditBlog",
    component: EditBlog,
  },
];


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
