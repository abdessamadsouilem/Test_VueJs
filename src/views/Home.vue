<template>
  <div class="home">
    <div class="header">
      <h1>Welcome to Your Blog again</h1>
      <p>Now you can share your thoughts with the world.</p>
    </div>
    <div class="content">
      <button class="button is-primary" @click="Create">Create new Blog</button>
    </div>
    <h1>Blogs you Have</h1>
    <div class="blogs">
    
      <div class="cards_blog" v-for="blog in blogs" :key="blog.id">
        <div class="card" > 
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title">title of Blog : {{blog.title}}</p>
              </div>
            </div>
            <div class="content">
              {{blog.body}}
              <br>
              <time datetime="2016-1-1">{{blog.createdAt}}</time>
            </div> 
          </div>
          <div class="actions" >
              <button class="Vue" @click="vue(blog.id)">Vue</button>
              <button class="Edit" @click="edit(blog.id)">Edit</button>
              <button class="Delete" @click="deleteBlog(blog.id)">Delete</button>
            </div>
        </div>
        </div>
      </div>

</div>
</template>

<script>
import firebase from "firebase/compat/app";
import db from "../firebase/firebaseInit.js";
export default {
  name: "Home",
  methods: {
    Create() {
      // check if blog info is not empty from local storage
      if (localStorage.getItem("title") !== null || localStorage.getItem("body") !== null||localStorage.getItem("video") !== null||localStorage.getItem("videoPreview") !== null) {
        // go te create blog page with step1 = true
        alert("You have a blog in progress, please finish it first");
        this.$router.push({ name: "CreateBlog", params: { step1: 1 } });
      }
      // if blog info is empty go to create blog page with step1 = false
      else {
        this.$router.push({ name: "CreateBlog", params: { step1: 0 } });
      }
    },
    vue(id) {
      this.$router.push("/Blog/" + id);
    },
    edit(id) {
      this.$router.push("/edit/" + id);
    },
    deleteBlog(id) {
      // alert confirmation
      if (confirm("Are you sure you want to delete this blog?")) {
        // delete blog from database
        db.collection("blogs")
          .doc(id)
          .delete()
          .then(() => {
            alert("Blog deleted successfully");
            // refresh the page
            this.$router.go();
          })
          .catch((error) => {
            alert("Error removing document: ", error);
          });
      }
    },
  },
  data() {
    return {
      blogs: [],
    };
  },
  beforeCreate() {
    db.collection("blogs")
      .onSnapshot((snapshot) => {
        this.blogs = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            createdAt: doc.data().createdAt,
          };
        });
      });
  },
};
</script>

<style scoped>
.header {
  text-align: center;
  margin-top: 10%;
}
.header h1 {
  font-size: 3rem;
}
.header p {
  font-size: 1.5rem;
}
.content {
  text-align: center;
  margin-top: 10%;
}
.content button {
  font-size: 1.5rem;
  color: white;
  background-color: #00d1b2;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
}
.blogs {
  margin-top: 10%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.card {
  width: 300px;
  height: 300px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
  margin: 10px;
}
.card-content {
  height: 70%;
  padding: 10px;
}
.card-content p {
  font-size: 1.2rem;
}
.card-content time {
  font-size: 0.8rem;
  color: #00d1b2;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 10px;
  }
.actions button {
  font-size: 1rem;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
.Vue {
  background-color: #00d1b2;
}
.Edit {
  background-color: #3273dc;
}
.Delete {
  background-color: #ff3860;
}



</style>
