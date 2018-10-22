/* eslint no-new: 0 */
import Vue from 'vue';
import App from './containers/App.vue';

// const bus = new Vue();
// export default bus;

new Vue({
    el: '#app',
    render: h => h(App),
});
