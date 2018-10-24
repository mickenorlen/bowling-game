import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './containers/App.vue';
import GameStart from './components/GameStart.vue';
import Bowling from './components/Bowling.vue';
// import Hello from '@/components/Hello'

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
        { path: '/', component: App },
        { path: '/player-selection', component: GameStart },
        { path: '/name-selection', component: GameStart },

        { path: '/bowling', component: Bowling },
        {
            path: '*',
            template: '404',
        },
    ],
});
