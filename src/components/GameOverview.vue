<script setup lang="ts">
import {ThreeService} from "../services/three-service.ts";
import { onMounted, onUpdated, useTemplateRef} from "vue";
import type {RawKing, RawPawn, RawTeam} from "../services/GameService.ts";
import {userService} from "../services/user-servive.ts";
import {useRouter} from "vue-router";

const props = defineProps<{
  pawnToUpdate: RawPawn,
  game: {
    pawns: RawPawn[],
    kings: RawKing[],
    teams: RawTeam[],
    active_team: null | number,
    created_at: string,
    game_mod: string,
    grid: [number, number][],
    id: string,
    status: string,
    is_finished: boolean,
    winner_team_id: number | null
  }
}>()
const router = useRouter();
const three = new ThreeService();
const gameOverview = useTemplateRef('game-overview');

 function findWinnerName () {
   return props.game.teams.find((team) => team.id === props.game.winner_team_id)?.name;
 }

onMounted(()=> {
  if (gameOverview.value) {
    three.init(gameOverview.value)
    three.generateBattleField(props.game.grid)
    three.setUser(userService.me);
    three.generatePawns(props.game.pawns, props.game.teams);
    three.consumeGameInformation( {
      pawns: props.game.pawns,
      kings: props.game.kings,
      teams: props.game.teams,
      gameInformation: {
        active_team: props.game.active_team,
        game_mod: props.game.game_mod,
        grid: props.game.grid,
        id: props.game.id,
        status: props.game.status
      } })
  }
})

onUpdated( ()=> {
  if (props.pawnToUpdate) {
    three.applyPawnChangesFromDB(props.pawnToUpdate)
  }
  three.consumeGameInformation( {
    pawns: props.game.pawns,
    kings: props.game.kings,
    teams: props.game.teams,
    gameInformation: {
      active_team: props.game.active_team,
      game_mod: props.game.game_mod,
      grid: props.game.grid,
      id: props.game.id,
      status: props.game.status
    } })
  three.setUser(userService.me); // Peut être too much xD
})


</script>

<template>
  <div class="game-container">
    <div v-if="findWinnerName()" class="overlay-container">
      <div class="overlay-popin">
        <span>{{`${findWinnerName()} à gagné(e) !!`}}</span>
        <button :onclick="async () => await router.push(`/`)">Retour à l'accueil</button>
      </div>
    </div>
    <canvas ref="game-overview" class="pawn-shader" width="900px" height="500px" ></canvas>
  </div>
</template>

<style scoped>
.game-container {
  position: relative;

}
.overlay-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;

  .overlay-popin {
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 2rem;
    color: black;
    border-radius: 2rem;
    border: 3px solid darkgreen;
  }
}



</style>