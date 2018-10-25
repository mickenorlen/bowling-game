<template>
  <div id="app" :style="{ 'background-image': `url('/img/${$store.state.bgImg}')` }">
    <transition>
      <router-view :rounds="rounds" :maxPlayers="maxPlayers" :maxNameLength="maxNameLength"/>
    </transition>
  </div>
</template>

<script>

export default {
  props: {
    maxPlayers: { type: Number, default: 5 },
    maxNameLength: { type: Number, default: 20 },
    rounds: { type: Number, default: 10 },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/_variables";

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-position: left center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  transition: background-image 0.3s ease-out;
}
</style>
