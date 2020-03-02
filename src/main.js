import Vue from 'vue'
import App from './App.vue'
import { firestorePlugin } from 'vuefire';
import 'firebase/firestore'

Vue.use(firestorePlugin);

Vue.config.productionTip = false;

export const eventBus = new Vue();

new Vue({
  render: h => h(App),
}).$mount('#app');
