<template>
    <div>
        <!-- Player number selection -->
        <div class="player-nrs" :class="{ hidden: showNameInput }">
            <h1>Number of players</h1>
            <button
                class="player-nr"
                v-for="n in maxPlayers"
                @click="showNameInput=true"
                :key="n"
            >{{ n }}</button>
        </div>
        <!-- Player name selection -->
        <form class="player-names" ref="pNames" :class="{ hidden: !showNameInput }">
            <h1>Select your names!</h1>
            <div class="player-name" v-for="(player, i) in playerNames" :key="i">
                <h3>Player {{ i + 1 }}</h3>
                <input type="text" v-on:input="playerNames[i] = $event.target.value">
            </div>
            <!-- Input Errors -->
            <div class="input-errors">
                <p v-for="(inputError, i) in inputErrors" :key="i">{{ inputError }}</p>
            </div>
            <button type="button" @click="startGame()">Start Game!</button>
        </form>
    </div>
</template>


<script>
export default {
    props: {
        maxPlayers: Number,
        maxNameLength: Number,
        playerNames: Array,
    },
    data() {
        return {
            maxNameLen: 20,
            showNameInput: false,
            inputErrors: [],
        };
    },
    methods: {
        startGame() {
            this.validateNameInput();

            if (this.inputErrors.length === 0) {
                this.$emit('startGame', this.playerNames);
            }
        },
        validateNameInput() {
            this.inputErrors = [];
            this.playerNames.forEach((name, key) => {
                // Name length
                if (!name) {
                    this.inputErrors.push(`PlayerName ${key + 1} undefined`);
                } else if (name.length > this.maxNameLength) {
                    this.inputErrors.push(`PlayerName ${key + 1} more than 20 chars`);
                }
            });
        },
    },
};
</script>


<style lang="scss" scoped>
.player-nrs {
    .player-nr {
        padding: 2em;
    }
}

.player-names {
    .player-name {
        margin-bottom: 0.5em;
        h3 {
            display: inline;
            margin-right: 1em;
        }
    }
}
</style>
