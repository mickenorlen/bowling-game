<template>
    <div
        id="app"
        :style="{ background: `url('/img/${$store.state.bgImg}') no-repeat center center fixed` }"
    >
            <transition>
                <router-view
                    :rounds="rounds"
                    :maxPlayers="maxPlayers"
                    :maxNameLength="maxNameLength"
                />
            </transition>
        </div>
</template>

<script>
import { getWinner } from '../../utils/bowlingUtils';

export default {
    data() {
        return {
            winner: getWinner(this.$store.state.players.map),
        }
    },
    mounted() {
        this.$store.commit('setState', { bgImg: this.bgImg });
    },
    methods: {
        getWinner() {
            const maxResult =
            console.log(object);this.$store.state.players.map(p => (p.results[p.results.length - 1]));
            console.log(object);
        },
    }
};
</script>

<style lang="scss" scoped>
    @import "../../../styles/_variables";
</style>
