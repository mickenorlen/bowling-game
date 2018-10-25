<template>
  <div class="table-wrapper">
    <table class="results-tables">
      <div class="player-results" v-for="(player, index) in players" :key="index">
        <h3 class="name">{{ player.name }}</h3>
        <tbody v-for="rowNr in getRowNrs()" :key="rowNr" ref="table" class="results-table">
          <tr>
            <th
              class="rounds"
              :class="{'second-row': getRowNrs() === 2 && rowNr === 2}"
              v-for="colNr in getColNr()"
              :key="colNr"
            >{{ getShotNr(colNr, rowNr) }}</th>
          </tr>
          <tr>
            <td
              class="shots"
              :class="{ 'last-col-first-row': getRowNrs() === 2 && getShotNr(colNr, rowNr) === 5 }"
              v-for="(colNr) in getColNr()"
              :key="colNr"
            >
              <table>
                <tbody>
                  <tr>
                    <td>{{ renderShotResult(player, getShotNr(colNr, rowNr), 'first') }}</td>
                    <td>{{ renderShotResult(player, getShotNr(colNr, rowNr)) }}</td>
                    <!-- Handlebars template -->
                    <td
                      v-if="getShotNr(colNr, rowNr) === 10"
                    >{{ renderShotResult(player, getShotNr(colNr, rowNr), 'last') }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td
              class="round-results"
              v-for="colNr in getColNr()"
              :key="colNr"
            >{{ player.result[getShotNr(colNr, rowNr) - 1] }}</td>
          </tr>
        </tbody>
      </div>
      <!-- Bottom wrapper -->
      <div class="bottom-wrapper">
        <transition name="fade">
          <button
            v-if="!winnerMsg"
            id="make-shot-btn"
            class="hoverable no-transition-on-load"
            @click="makeShot"
          >Play round</button>
        </transition>
        <transition name="fade">
          <h2
            :style="{ width: `${$refs.table[0].offsetWidth}px` }"
            class="winner-msg"
            v-if="winnerMsg"
          >{{ winnerMsg }}</h2>
        </transition>
      </div>
    </table>
  </div>
</template>


<script>
import { makeShot, getWinnerMsg, toInt } from '../../utils/bowling';

export default {
  props: {
    rounds: Number,
    bgImg: { type: String, default: 'bowling.jpeg' },
  },
  data() {
    return {
      // hej,
      players: this.createPlayerObjs(),
      shotIndex: 0,
      winnerMsg: false, // Defined when game is over
      pExtraShot: [], // Players who earned an extra shot in last round
      windowWidth: window.innerWidth, // Pixel value when table row is split in two
      splitRowPoint: 769,
    };
  },
  mounted() {
    this.$store.commit('setState', { bgImg: this.bgImg });
    // Store window width for table row split
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  },
  methods: {
    /**
     * @description Get the shot number, starting at 1
     * @param {Number} colNr table column
     * @param {Number} rowNr table row
     */
    getShotNr(colNr, rowNr) {
      if (rowNr === 2) {
        return colNr + this.rounds / 2;
      }
      return colNr;
    },

    /**
     * @description Get the column number depending on windows size
     */
    getColNr() {
      if (this.windowWidth < this.splitRowPoint) {
        return this.rounds / 2;
      }
      return this.rounds;
    },

    /**
     * @description Get the number of rows depending on windows size
     */
    getRowNrs() {
      if (this.windowWidth < this.splitRowPoint) {
        return 2;
      }
      return 1;
    },

    /**
     * @description Make shot for each player
     */
    makeShot() {
      if (this.shotIndex === this.rounds * 2) {
        // If very last shot, make shot with players who earned it and display winner
        makeShot(this.pExtraShot, this.shotIndex, this.rounds);
        this.winnerMsg = getWinnerMsg(this.players);
      } else {
        // Make shot with all players
        makeShot(this.players, this.shotIndex, this.rounds);
      }
      this.shotIndex += 1;

      if (this.shotIndex === this.rounds * 2) {
        // Check if anyone earned extra shot
        this.checkExtraShot();
      }
    },

    /**
     * @description Will recreate on load. Only player names are cached
     */
    createPlayerObjs() {
      const players = this.$store.state.players.map(player => ({
        name: player.name,
        result: Array(this.rounds).fill(''),
        // Add 1 extra for last round
        shotResult: Array(this.rounds * 2 + 1).fill(''),
        totResult: 0,
      }));

      this.$store.state.players = players;
      return players;
    },

    /**
     * @description Get and render shot result in correct table cell
     * and translate relevant numbers to characters
     * @param {Obj} player
     * @param {Number} colNr
     * @param {String} position
     */
    renderShotResult(player, colNr, position) {
      const shotResI = colNr * 2 - 2; // Index of given shot result
      let shotRes;

      if (position === 'first') shotRes = player.shotResult[shotResI];
      // Offset if last or middle cell
      else if (position === 'last') shotRes = player.shotResult[shotResI + 2];
      else shotRes = player.shotResult[shotResI + 1];

      if (position !== 'first' && shotRes + player.shotResult[shotResI] === 10 && player.shotResult[shotResI] !== 10) {
        // If is second and (current shotres + prev shotres) = 10
        // and first isn't 10 (can happen in last round when continue after strike)
        shotRes = '/';
      } else if (shotRes === 10) {
        shotRes = 'X';
      } else if (shotRes === 0) {
        shotRes = String.fromCharCode(8211);
      }
      return shotRes;
    },

    /**
     * @description Check if any of the players earned an extra shot.
     * If not, game over and render winner message
     */
    checkExtraShot() {
      this.players.forEach(p => {
        if (p.shotResult[p.shotResult.length - 3]
          + toInt(p.shotResult[p.shotResult.length - 2])
          >= 10) {
          this.pExtraShot.push(p);
        }
      });

      if (!this.pExtraShot.length) {
        this.winnerMsg = getWinnerMsg(this.players);
      }
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../../styles/_variables";
@import "../../../styles/_bowling";
</style>
