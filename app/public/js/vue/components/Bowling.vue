<template>
    <div id="results-wrapper">
        <table id="results-tables">
            <div v-for="(player, index) in players" :key="index">
                <h3 class="name">{{ player.name }}</h3>
                <tbody class="results-table">
                    <tr>
                        <th class="rounds" v-for="(round, i) in rounds" :key="i">{{ i + 1 }}</th>
                    </tr>
                    <tr>
                        <td class="subrounds" v-for="(round, i) in rounds" :key="i">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{{ renderSubResult(player, i, 'first') }}</td>
                                        <td>{{ renderSubResult(player, i) }}</td>
                                        <!-- Handlebars template -->
                                        <td v-if="i === 9">{{ renderSubResult(player, i, 'last') }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td
                            class="round-results"
                            v-for="(round, i) in rounds"
                            :key="i"
                        >{{ player.result[i] }}</td>
                    </tr>
                </tbody>
            </div>
        </table>
        <button id="play-round-btn" @click="playRound">Play round</button>
    </div>
</template>


<script>
import { playRound, toInt } from '../../utils/bowlingUtils';

export default {
    props: {
        playerNames: Array,
        rounds: Number,
    },
    data() {
        return {
            players: this.createPlayerObjs(),
            subRound: 0,
        };
    },
    methods: {
        playRound() {
            if (this.subRound >= this.rounds * 2 + 1) {
                console.log('GAME OVER');
            } else if (this.subRound === this.rounds * 2) {
                this.checkExtraShot();
            } else {
                playRound(this.players, this.subRound, this.rounds);
                this.subRound += 1;
            }
        },
        createPlayerObjs() {
            const playerObj = this.playerNames.map((name) => ({
                name,
                result: Array(this.rounds).fill(''),
                // Add 1 extra for last round
                subResult: Array(this.rounds * 2 + 1).fill(''),
                totResult: 0,
            }));
            return playerObj;
        },
        renderSubResult(player, i, position) {
            const subResI = (i + 1) * 2 - 2;
            let subRes;

            if (position === 'first') subRes = player.subResult[subResI];
            else if (position === 'last') subRes = player.subResult[subResI + 2];
            else subRes = player.subResult[subResI + 1];

            if (position !== 'first' && subRes + player.subResult[subResI] === 10 && player.subResult[subResI] !== 10) {
                // If is second and (current subres + prev subres) = 10
                // and first isn't 10 (can happen in last round when continue after strike)
                subRes = '/';
            } else if (subRes === 10) {
                subRes = 'X';
            } else if (subRes === 0) {
                subRes = String.fromCharCode(8211);
            }
            return subRes;
        },
        checkExtraShot() {
            const pExtraShot = [];
            this.players.forEach(p => {
                if (p.subResult[p.subResult.length - 3] + toInt(p.subResult[p.subResult.length - 2]) >= 10) {
                    pExtraShot.push(p);
                }
            });

            if (pExtraShot.length) {
                playRound(pExtraShot, this.subRound, this.rounds);
                console.log('GAME OVER AFTER EXTRA SHOT');
            } else {
                console.log('GAME OVER WITHOUT EXTRA SHOT');
            }

            this.subRound += 1;
        },
    },
};
</script>


<style lang="scss" scoped>
@import "../../../styles/_variables";

#results-wrapper {
    #results-tables {
        border-spacing: 0;

        h3.name {
            margin-bottom: 0.4em;
        }

        .results-table {
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

    #play-round-btn {
        padding: 0.5em 1em;
        margin-top: 1em;
    }
}
</style>
