<template>
    <div id="app">
        <h1>BOWLING</h1>
        <span class="label">app</span>
        <div class="container">
            This comp {{ currentComp }}
            <hr>
            <component
                :is="currentComp"
                :rounds="rounds"
                :maxPlayers="maxPlayers"
                :maxNameLength="maxNameLength"
                :playerNames="playerNames"
                v-on:startGame="startGame"
            ></component>
        </div>
    </div>
</template>

<script>
// import bus from '../vue-init';
import Bowling from '../components/Bowling.vue';
import GameStart from '../components/GameStart.vue';


export default {
    data() {
        return {
            currentComp: 'Bowling',
            playerNames: ['micke'],
            rounds: 10,
            maxPlayers: 5,
            maxNameLength: 20,
        };
    },
    methods: {
        startGame(playerNames) {
            this.playerNames = playerNames;
            this.currentComp = 'Bowling';
        },
    },
    components: {
        /* eslint-disable vue/no-unused-components */
        Bowling,
        GameStart,
    },
};
</script>
