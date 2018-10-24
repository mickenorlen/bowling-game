<template>
    <table class="results-tables">
        <div class="player-results" v-for="(player, index) in players" :key="index">
            <h3 class="name">{{ player.name }}</h3>
            <tbody v-for="n in getRowNr()" :key="n" class="results-table">
                <tr>
                    <th
                        class="rounds"
                        v-for="(round, i) in getLimit()"
                        :key="i"
                    >{{ getI(i, n) + 1 }}</th>
                </tr>
                <tr>
                    <td class="subrounds" v-for="(round, i) in getLimit()" :key="i">
                        <table>
                            <tbody>
                                <tr>
                                    <td>{{ renderShotResult(player, getI(i, n), 'first') }}</td>
                                    <td>{{ renderShotResult(player, getI(i, n)) }}</td>
                                    <!-- Handlebars template -->
                                    <td
                                        v-if="getI(i, n) === 9"
                                    >{{ renderShotResult(player, getI(i, n), 'last') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td
                        class="round-results"
                        v-for="(round, i) in getLimit()"
                        :key="i"
                    >{{ player.result[getI(i, n)] }}</td>
                </tr>
            </tbody>
        </div>
        <!-- Bottom wrapper -->
        <div class="bottom-wrapper">
            <transition name="fade">
                <button
                    v-if="!winnerMsg"
                    id="play-round-btn"
                    class="hoverable no-transition-on-load"
                    @click="playRound"
                >Play round</button>
            </transition>
            <transition name="fade">
                <h1 class="winner-msg" v-if="winnerMsg">{{ winnerMsg }}</h1>
            </transition>
        </div>
    </table>
</template>


<script>
import { playRound, getWinnerMsg, toInt } from '../../utils/bowlingUtils';

export default {
    props: {
        rounds: Number,
        bgImg: { type: String, default: 'bowling.jpeg' },
    },
    data() {
        return {
            players: this.createPlayerObjs(),
            subRound: 0,
            winnerMsg: false,
            pExtraShot: [],
            windowWidth: window.innerWidth,
            splitRowPoint: 730,
        };
    },
    mounted() {
        this.$store.commit('setState', { bgImg: this.bgImg });
        this.$nextTick(() => {
            window.addEventListener('resize', () => {
                this.windowWidth = window.innerWidth;
            });
        });
    },
    methods: {
        getI(i, n) {
            if (n === 2) {
                return i + this.rounds / 2;
            }
            return i;
        },
        getLimit() {
            if (this.windowWidth < this.splitRowPoint) {
                return this.rounds / 2;
            }
            return this.rounds;
        },
        getRowNr() {
            if (this.windowWidth < this.splitRowPoint) {
                return 2;
            }
            return 1;
        },
        playRound() {
            playRound(this.players, this.subRound, this.rounds);
            this.subRound += 1;
            if (this.subRound === this.rounds * 2) {
                this.checkExtraShot();
            } else if (this.subRound === this.rounds * 2 + 1) {
                playRound(this.pExtraShot, this.subRound, this.rounds);
                this.winnerMsg = getWinnerMsg(this.players);
            }
        },
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
        renderShotResult(player, i, position) {
            const shotResI = (i + 1) * 2 - 2;
            let shotRes;

            if (position === 'first') shotRes = player.shotResult[shotResI];
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
        checkExtraShot() {
            this.players.forEach(p => {
                if (p.shotResult[p.shotResult.length - 3] + toInt(p.shotResult[p.shotResult.length - 2]) >= 10) {
                    this.pExtraShot.push(p);
                }
            });

            if (!this.pExtraShot.length) {
                this.winner = getWinnerMsg(this.players);
            }
        },
    },
};
</script>


<style lang="scss" scoped>
@import "../../../styles/_variables";

.results-tables {
    margin: $padding;

    background-color: rgba(2, 31, 60, 0.5);
    border-radius: 5px;
    height: 80vh;
    padding: 40px 60px;
    position: relative;
    border-spacing: 0;

    .player-results {
        h3.name {
            margin-bottom: 0.4em;
        }

        .results-table {
            position: relative;
            text-align: center;
            font-family: "monospace";

            td.subrounds {
                padding: 0;
                background-color: $table-background-light;
                color: $font-color-highlight;
                border: $table-border-strong;
                border-left: 0;
                font-size: $font-size-small;
                &:first-child {
                    border-left: $table-border-strong;
                }

                table {
                    border-spacing: 0;
                    display: table-cell;
                    td {
                        min-width: $table-cell-width;
                        height: $table-cell-height;
                        padding: $table-cell-padding;
                        padding-left: 0.5em;
                        padding-right: 0.5em;
                        &:nth-child(even),
                        &:last-child {
                            border-left: $table-border-light;
                        }
                    }
                }

                td {
                    padding: 3px;
                }
            }

            td.round-results {
                text-align: center;
                border-right: $table-border-strong;
                border-bottom: $table-border-strong;
                min-width: $table-cell-width;
                height: $table-cell-height;
                padding: $table-cell-padding;

                &:first-child {
                    border-left: $table-border-strong;
                }
            }
        }
    }

    .bottom-wrapper {
        position: relative;
        text-align: right;
        margin-top: 2em;
        height: 3em;

        .winner-msg,
        button {
            right: 0;
            position: absolute;
            display: inline-block;
            margin: 0;
        }

        button#play-round-btn {
            text-align: right;
            padding: 1em 3em;
            border-radius: 3px;
            box-shadow: $z-depth-1;
            background-color: $font-color;
            border: 0;
            color: $font-color-dark;
            font-weight: bold;
        }
    }

    // Media queries
    @media (max-width: $screen-sm-max) {
        margin: $padding / 2 auto;
        font-size: $font-size * 0.7;
        td.subrounds {
            font-size: $font-size-small * 0.7 !important;
        }
        button#play-round-btn {
            font-size: $font-size * 0.7;
        }
    }

    @media (max-width: 380px) {
        margin: 0 auto;
        height: 100vh !important;
        font-size: $font-size * 0.6;
        td.subrounds {
            font-size: $font-size-small * 0.6 !important;
        }
        button#play-round-btn {
            font-size: $font-size * 0.6;
        }
    }
}
</style>
