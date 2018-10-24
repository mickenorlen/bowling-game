import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// Components
import App from './containers/App.vue';
import GameStart from './components/GameStart.vue';
import Bowling from './components/Bowling.vue';
import NotFound from './components/NotFound.vue';

Vue.use(Vuex);
Vue.use(VueRouter);

// Bowling app
/* eslint-disable-next-line: no-new */
new Vue({
    // Localstorage for caching
    store: new Vuex.Store({
        // Default state
        state: {
            players: [],
            bgImg: 'intro.jpg',
        },
        plugins: [createPersistedState()],
        mutations: {
            setState(state, params) {
                const s = state;
                Object.keys(params).forEach(key => {
                    s[key] = params[key];
                });
            },
        },
    }),
    // Route paths to create browser history
    router: new VueRouter({
        mode: 'history',
        routes: [
            {
                path: '/',
                component: GameStart,
            },
            {
                path: '/player-selection',
                component: GameStart,
                props: { showPlayerSelection: true },
            },
            {
                path: '/name-selection',
                component: GameStart,
                props: { showNameSelection: true },
            },
            { path: '/bowling', component: Bowling },
            // Catch all 404
            { path: '*', component: NotFound },
        ],
    }),
    render: h => h(App),
}).$mount('#app');
