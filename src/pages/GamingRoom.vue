<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router';
import {computed, onMounted, ref, watch} from 'vue';
import {type GameInformation, type RawPawn, type RawTeam, STATUSES} from '../services/GameService.ts';
import GameOverview from '../components/GameOverview.vue';
import {RequestService} from "../services/request-service.ts";
import {Subscritpions} from "../services/subscritpions.ts";
import {userService} from "../services/user-servive.ts";
import GenerateLinkButton from "../components/GenerateLinkButton.vue";
import GameRules from "../components/GameRules.vue";

const route = useRoute();
const router = useRouter();
const teamToUpdate = ref();
const pawnToUpdate = ref();
const gameInformation = ref();
const activeTeam = ref()
// todo prob avec le typing

Subscritpions.subGame(route.params.id, setUpdatedGameInfo);
Subscritpions.subTeams(route.params.id, setTeamsInfo );
Subscritpions.subPawns(route.params.id, setPawnsInfo );

const game = ref();

watch([teamToUpdate, pawnToUpdate, gameInformation ],  async ()=> {
  game.value = await RequestService.get('/games', {id: route.params.id});

  const activeTeamId = game?.value?.active_team;
  activeTeam.value = game?.value?.teams?.find((team : RawTeam) => team.id === activeTeamId);

  if (game.value?.status === STATUSES.CREATED && game.value?.teams?.every((team) => team.selected)) {
    await RequestService.put('/games', {id: game.value.id, status: STATUSES.STARTED })
  }
})

function setUpdatedGameInfo (payload:GameInformation | unknown) {
  gameInformation.value = payload;
}

function setPawnsInfo (payload: RawPawn | unknown) {
  pawnToUpdate.value = payload;
}
function setTeamsInfo (payload: RawTeam | unknown) {
  teamToUpdate.value = payload;
}

function isInformationLoaded () {
  return game.value?.status
      && game.value?.teams?.length > 0
      && game.value?.pawns?.length > 0
}

const imInTheGame = computed(() => {
  return game.value?.teams?.find((team: RawTeam)=> team.user_id === userService.me)
})

async function selectTeam (teamId: number) {
  await RequestService.put('/teams', {id: teamId, user_id: userService.me || null, selected: true})
}

const linkInvitation = computed(() => {
  return new URL(route.fullPath, window.location.origin).href;
})

onMounted(async ()=> {
  game.value = await RequestService.get('/games', {id:route.params.id})

  const activeTeamId = game?.value?.active_team;
  activeTeam.value = game?.value?.teams?.find((team : RawTeam) => team.id === activeTeamId);
})

</script>

<template>

  <h1> Top Cap duel</h1>
  <section v-if="game?.status === STATUSES.CREATED &&  game?.game_mod === 'distant'">
    <div v-if="!imInTheGame">
      <h2>Choix de l'équipe</h2>
      <div v-for="team in game?.teams">
        <button v-if="!team.selected"  :onclick="()=>selectTeam(team.id)" class="button-choice">
          <p>{{team.name}}</p>
          <img class="team-icon" src="/assets/avatars/nut-face.png" alt="computeur image" />
        </button>
      </div>
    </div>
    <div v-else-if="imInTheGame">
      <h2> En attente de votre adversaire </h2>

      <GenerateLinkButton :url="linkInvitation" />
    </div>
  </section>
   <section>
     <GameRules />
     <h2 v-if="game?.status === STATUSES.STARTED && game.game_mod === 'distant'">
       <span v-if="activeTeam?.user_id === userService.me">
        {{ `C'est à vous de jouer` }}
       </span>
       <span v-else>
        {{ `En attente du joueur: ${activeTeam?.name}` }}
       </span>
     </h2>
     <h2 v-else>
       {{ `Joueur actif: ${activeTeam?.name}` }}
     </h2>
   </section>
   <GameOverview v-if="
       (game?.status !== STATUSES.CREATED && (isInformationLoaded() && imInTheGame && game?.game_mod === 'distant')) ||
       (game?.game_mod=== 'local' && isInformationLoaded())"
       :game="game"
       :pawnToUpdate
   />

   <button :onclick="() => router.go(-1)">back</button>

</template>

<style scoped>

.team-icon {
    width: 100px;
}

.button-choice {
    text-align: center;
    margin: 10px;
    padding: 1rem;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.5);
}

</style>