<template>
  <div class="container">
    <!-- Welcome Screen -->
    <transition name="fade">
      <div class="container-inner welcome-screen" v-if="!showPlayerSelection && !showNameSelection">
        <h1>Welcome to the Bowling game</h1>
        <button
          class="hoverable no-transition-on-load"
          @click="$router.push('/player-selection')"
        >Start game</button>
      </div>
    </transition>
    <!-- Player number selection -->
    <transition name="fade">
      <div class="container-inner player-nrs" v-if="showPlayerSelection">
        <h1>Number of players</h1>
        <button
          class="player-nr hoverable no-transition-on-load"
          v-for="n in maxPlayers"
          @click="routeNameInput(n)"
          :key="n"
        >{{ n }}</button>
      </div>
    </transition>
    <!-- Player name selection -->
    <transition name="fade">
      <form class="container-inner player-names" v-if="showNameSelection">
        <h1>Select your names!</h1>
        <div class="player-name" v-for="(player, i) in tmpPlayers" :key="i">
          <h3>Player {{ i + 1 }}</h3>
          <input
            :class="{ 'input-error': tmpPlayers[i].inputError }"
            :value="tmpPlayers[i].name"
            type="text"
            v-on:input="handleInput(i, $event.target.value)"
          >
        </div>
        <!-- Input Errors -->
        <div class="validation">
          <p>Character limits: 1-20</p>
          <div class="input-errors" v-if="inputErrors.length">
            <p v-for="(inputError, i) in inputErrors" :key="i">{{ inputError }}</p>
          </div>
        </div>
        <button type="button" @click="routeBowling()">Start Bowling!</button>
      </form>
    </transition>
  </div>
</template>


<script>
export default {
  props: {
    maxPlayers: Number,
    maxNameLength: Number,
    showNameSelection: { type: Boolean, default: false },
    showPlayerSelection: { type: Boolean, default: false },
    bgImg: { type: String, default: 'intro.jpg' },
  },
  data() {
    return {
      maxNameLen: 20,
      inputErrors: [],
      tmpPlayers: this.$store.state.players,
    };
  },
  mounted() {
    this.$store.commit('setState', { bgImg: this.bgImg });
  },
  methods: {
    routeNameInput(n) {
      // Create new player objects but keep any existing names
      for (let i = 0; i < n; i += 1) {
        if (this.tmpPlayers[i]) {
          this.tmpPlayers[i] = { name: this.tmpPlayers[i].name };
        } else {
          this.tmpPlayers[i] = { name: '' };
        }
      }
      this.tmpPlayers.length = n;
      this.$store.commit('setState', { players: this.tmpPlayers });
      // Route
      this.$router.push('name-selection');
    },
    // Route to bowling game
    routeBowling() {
      this.renderAnyInputErrors();

      if (this.inputErrors.length === 0) {
        this.$store.commit('setState', { players: this.tmpPlayers });
        this.$router.push('/bowling');
      }
    },
    // Add name input to tmp player objects
    handleInput(i, value) {
      this.tmpPlayers[i].name = value;
      // Show warning border if error
      if (value.length > this.maxNameLength || !value) {
        this.tmpPlayers[i].inputError = true;
      } else {
        delete this.tmpPlayers[i].inputError;
      }
    },
    renderAnyInputErrors() {
      this.inputErrors = [];
      this.tmpPlayers.forEach((p, key) => {
        // Name length
        if (!p.name) {
          this.inputErrors.push(`Player ${key + 1} needs a name`);
        } else if (p.name.length > this.maxNameLength) {
          this.inputErrors.push(`Player ${key + 1} more than ${this.maxNameLength} characters`);
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../../styles/_variables";
@import "../../../styles/_game-start";
</style>
