import { defineStore } from 'pinia';

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    title: localStorage.getItem('title') || '',
    body: localStorage.getItem('body') || '',
    videos:  [],
  }),
  actions: {
    async saveBlog(t,b,v) {
      localStorage.setItem('title', t);
      localStorage.setItem('body', b);
      
    }
  },
});

