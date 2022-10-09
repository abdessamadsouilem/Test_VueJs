<template>
  <div class="create">
    <h1>Create a new Blog </h1>
    <div v-if="!step1 && this.$route.params.step1!=1" class="content_step1">
      <div class="Blog_title">
        <label class="label">Title</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="Text input"
            v-model="title"
          />
        </div>
      </div>
      <div class="Blog_body">
        <label class="label">Body</label>
        <div class="control">
          <textarea
            class="textarea"
            placeholder="Textarea"
            v-model="body"
          ></textarea>
        </div>
      </div>
     
      <div class="Blog_video">
        <label class="label">Video</label>
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
    <div v-else class="content_step2">
    <h1>
    Your Blog is ready to be published
    </h1>
    <p>
    here is a preview of your blog , you can edit it or publish it 
    </p>
    <div>
    <div class="blog_title">
    <h1>{{title}}</h1>
    </div>
    <div class="blog_body">
    <p>{{body}}</p>
    </div>
    <div class="videos" v-for="video in videoPreview" :key="video.name">
    <!-- video with time start and time end -->
    <video
      :src="video.url"
      controls
      class="video"
      width="320"
      height="240"
    ></video>
    <p>
    Here you can choose the time to start and end the video
    </p>
    <div class="time">
    <label class="label">Start</label>
    <div class="control">
      <input
        class="input"
        type="number"
        placeholder="Time in seconds"
        v-model="video.start"
        
      />
    </div>
    </div>
    <div class="time">
    <label class="label">End</label>
    <div class="control">
      <input
        class="input"
        type="number"
        placeholder="Time in seconds"
        v-model="video.end"
        :max="video.duration"
      />
      </div>  
      </div>
    <div class="Blog_submit_time">
    <button class="button is-primary" @click="changeStartEnd(video.start,video.end ,video)">Save Time</button>
    </div>
    </div>

    <button class="publish" @click="publish">Publish</button>
    </div> 
    </div>
    </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import db from "../firebase/firebaseInit.js";
import {useStore} from "../store/index.js";
export default {
  name: "CreateBlog",
  data() {
    return {
      title: "",
      body: "",
      videos: [],
      step1: false,
      videosUrl: [],
      videoPreview: [],
    };
  },
  mounted() {
      if (this.$route.params.step1 == 1) {
        // get the data from local storage
        this.title = localStorage.getItem("title");
        this.body = localStorage.getItem("body");
        this.videos = JSON.parse(localStorage.getItem("video"));
        
        this.videoPreview = JSON.parse(localStorage.getItem("videoPreview"));
        console.log(this.videoPreview[0].name);
        this.step1 = true;
      }
    },
  methods: {
    onFileChange(e) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        this.videos.push(files[i]);
      }
      console.log(this.videos);

      const Test = JSON.stringify(this.videos);
      //
      const Re = JSON.parse(Test);
      console.log(Re[0].name);

    },
    getDuration(file) {
     return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration);
        };
        video.onerror = function () {
          reject("error");
        };
        video.src = URL.createObjectURL(file);
      });
    },
    submit() {
      for (let i = 0; i < this.videos.length; i++) {
        // create Object URL
        const url = URL.createObjectURL(this.videos[i]);
        const durationOfVideo =  this.getDuration(this.videos[i]);
       // push all information about the video and the url 
        async function pushInfo(video, url) {
          const info = {
            name: video.name,
            url: url,
            duration: await durationOfVideo,
            start: 0,
            end: 0,
          };
          return info;
        }
        const info = pushInfo(this.videos[i], url);
        info.then((info) => {
          this.videoPreview.push(info);
        });

        console.log(this.videoPreview);

      }

      // save the data in useStore
      const store = useStore();
      store.saveBlog(this.title, this.body, this.videoPreview); 
      this.step1 = true;    
    },
    changeStartEnd(a,b,c){
      // change the start and end time of the video
      const index = this.videoPreview.indexOf(c);
      this.videoPreview[index].start = a;
      this.videoPreview[index].end = b;
    },
    publish() {
      const storageRef = firebase.storage().ref();
      for (let i = 0; i < this.videos.length; i++) { 
        // upload the video to firebase 
        const videoRef = storageRef.child("blog/blogVideo/" + "video" + this.title + "_"+ i+1);
        videoRef.put(this.videos[i]).on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("upload is " + progress + "% done");
          },
          (error) => {
            console.log(error);
          },
          async () => {
            await videoRef.getDownloadURL().then((url) => {
              this.videosUrl.push(
                {
                  name: this.videos[i].name,
                  url: url+"#t="+this.videoPreview[i].start+","+this.videoPreview[i].end,
                  start: this.videoPreview[i].start,
                  end: this.videoPreview[i].end,
                }
              );
            });
            

            if (this.videosUrl.length == this.videos.length) {
              // get the date 
              const date = new Date();
              const day = date.getDate();
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
             
              
              
              db.collection("blogs")
                .add({
                  title: this.title,
                  body: this.body,
                  video: this.videosUrl,
                  createdAt: day + "/" + month + "/" + year,
                })
                .then((docRef) => {
                  console.log("Document written with ID: ", docRef.id);
                })
                .catch((error) => {
                  console.error("Error adding document: ", error);
                });
            }
          },
        );
      }      
    },
    
  }
};
</script>

<style scoped>
/* style for CreateBlog.vue */
.create {
  margin: 0 auto;
  width: 100%;
}
.content_step1 {
width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.content_step2 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.Blog_title{
width: 60%;
  margin: 20px;
}

.Blog_title label {
  font-size: 20px;
  font-weight: bold;
  color: #000;
  padding: 10px;
}
.control {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.Blog_title input {
  width: 50%;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}
.Blog_body {
  width: 60%;
  margin: 20px;
}
.Blog_body label {
  font-size: 20px;
  align-self: flex-start;
  font-weight: bold;
  color: #000;
  padding: 10px;
}
.Blog_body textarea {
  width: 50%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}

.Blog_video {
  width: 60%;
  margin: 20px;
}
.Blog_video label {
  font-size: 20px;
  align-self: flex-start;
  font-weight: bold;
  color: #000;
  padding: 10px;
}
.Blog_video input {
  width: 50%;
  height: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}

.Blog_submit {
  width: 60%;
  margin: 20px;
}
.Blog_submit button {
  width: 40%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  color:#fff;
  background-color: #00d1b2;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
.blog_title h1 {
  font-size: 30px;
  font-weight: bold;
  color: #000;
  padding: 10px;
}
.blog_body p{
  font-size: 20px;
  font-weight: lighter;
  color: #000;
  padding: 10px;
}

.Blog_submit_time button {
  width: 20%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  color:#fff;
  background-color: #00d1b2;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
}

.publish {
 width: 20%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  color:#fff;
  background-color: #00d1b2;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
}




</style>
