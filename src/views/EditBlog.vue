<template>

<div>
<!-- edit Blog -->
   <div class="content_step1">
      <div class="Blog_title">
        <label class="label">Title</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Text input"
            v-model="blog.title"
          />
        </div>
      </div>
      <div class="Blog_body">
        <label class="label">Body</label>
        <div class="control">
          <textarea
            class="textarea"
            placeholder="Textarea"
            v-model="blog.body"
          ></textarea>
        </div>
      </div>
      <div  v-for="video in blog.video" :key="video.name" class="delete_video">
        <video
    :src="video.url"
    class="my-video"
    width="320"
    height="240"
    ></video>
        <button class="button is-danger" @click="deleteVideo(video.name)">Delete</button>
        </div>

     
      <div class="Blog_video">
        <label class="label">Add new Videos</label>
        <div class="control">
          <input
            class="input"
            type="file"
            accept=".mp4 , .webm"
            multiple
            @change="onFileChange"
          />
        </div>
      </div>
      <div class="Blog_submit">
        <button class="button is-primary" @click="submit">Submit</button>
      </div>
    </div>
<div >


</div>

</div>
    

</template>

<script>
import db from "../firebase/firebaseInit.js";
import "firebase/compat/storage";
import firebase from "firebase/compat/app";
export default {
name: "EditBlog",
data() {
return {
blog: {},
videos :[],
};
},
beforeCreate() {
db.collection("blogs")
.doc(this.$route.params.id)
.onSnapshot((snapshot) => {
this.blog = {
id: snapshot.id,
title: snapshot.data().title,
body: snapshot.data().body,
video : snapshot.data().video,
// tansform the timestamp to a date
createdAt: snapshot.data().createdAt,
};
});
},
methods: {

deleteVideo(name){
this.blog.video = this.blog.video.filter(video => video.name !== name)
},
submit() {
if(this.videos.length > 0){
    // upload the videos
    this.videos.forEach((video) => {
        const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child("blog/blogVideo/" + "video" + this.title );
      fileRef.put(video).then(() => {
        fileRef.getDownloadURL().then((url) => {
          this.blog.video.push({name:video.name,url:url})
          db.collection("blogs")
            .doc(this.$route.params.id)
            .update({
              title: this.blog.title,
              body: this.blog.body,
              video: this.blog.video,
            })
            .then(() => {
              this.$router.push("/");
            });
        });
      });
    });
}
db.collection("blogs")
.doc(this.$route.params.id)
.update({
title: this.blog.title,
body: this.blog.body,
video : this.blog.video,
})
},
onFileChange(e) {

const files = e.target.files;
for (let i = 0; i < files.length; i++) {
this.videos.push(files[i]);
}
}
}
};
</script>


<style scoped>


</style>