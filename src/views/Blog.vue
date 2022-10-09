<template>
<div>
    <div class="container" >
    <div class="content">
    <div class="media">
    <div class="media-content">
    <p class="title">title of Blog : {{blog.title}}</p>
    </div>
    </div>
    <div class="content">
    {{blog.body}}
    <br>
    <time datetime="2016-1-1">{{
    blog.createdAt
        }}</time>
    </div>
    <div class="videos" v-for="video in blog.video" :key="video.name">
    <!-- video with time start and time end -->
    <video
    :src="video.url"
    class="my-video"
    width="320"
    height="240"
    autoplay=1
    ></video>
    </div>
    </div>

    </div>
</div>
    
</template>


<script>
import db from "../firebase/firebaseInit.js";
export default {
name: "Blog",
data() {
return {
blog: {},
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





};
</script>
