<script setup lang="ts">
import {computed, ref, type SelectHTMLAttributes} from "vue";
import PawnPreview from "./PawnPreview.vue";
import gltfFilesFormat from "../configs/gltf-files-format";
import { useRouter } from "vue-router";
import {RequestService} from "../services/request-service.ts";
import {STATUSES} from "../services/GameService.ts";


const pawnsConfigName = gltfFilesFormat.keys(); 
const pawnSkinNamePlayer1 = ref<string>(pawnsConfigName[0]);
const pawnSkinNamePlayer2 = ref<string>(pawnsConfigName[0]);

const teamName1 = ref('Team 1');
const teamName2 = ref('Team 2');
const gamePreSet = ref(1);
const gameMod = ref('distant');
const isLoading = ref(false);
const errorMessage = ref();


const router = useRouter()

async function submit (event: Event) {
    event.preventDefault();

    const gameConfig = {
      preset: gamePreSet.value,
      game_mod: gameMod.value,
      teams: [
        {name: teamName1.value, pawns_skin:pawnSkinNamePlayer1.value },
        {name: teamName2.value, pawns_skin:pawnSkinNamePlayer2.value }
      ]
    };

    if (gameMod.value === 'local') {
      gameConfig.status = STATUSES.STARTED;
    }

    try {
      isLoading.value = true;
      const gameCreated =  await RequestService.post('/games', gameConfig)
      if (gameCreated?.id) {
        await router.push(`/gaming-room/${gameCreated?.id}`);
      }
    } catch (error) {
      isLoading.value = false;
      errorMessage.value = 'Oops, une erreur est survenue!'
    }

}

function setPlayerName1 (event : EventTarget ) {
  teamName1.value = event.target.value;
}
function setPlayerName2 (event: EventTarget ) {
  teamName2.value = event.target.value;
}

function selectSkinPawnPlayer1 (event: SelectHTMLAttributes ) {
    pawnSkinNamePlayer1.value = event.target.value
}

function selectSkinPawnPlayer2 (event: SelectHTMLAttributes ) {
    pawnSkinNamePlayer2.value = event.target.value
}

function selectPreset (event: SelectHTMLAttributes ) {
   gamePreSet.value = event.target.value
}

function selectDistantMod () {
  gameMod.value = 'distant';
}

function selectLocalMod () {
  gameMod.value = 'local';
}

const imagePresetUrl = computed(() => {
  return `/assets/game-presets/preset_${gamePreSet.value}.png`
})

const isDistantModSelected = computed(() => {
  return gameMod.value === 'distant';
})
</script>

<template>
    <section class="parameters-container">
        <h2>Paramètre de la partie</h2>
        <form @submit.prevent="submit" class="settings-form" >
            <articles class="player">
                <h3>Joueur 1</h3>
                <label for="team-name-1">Nom de l'équipe</label>
                <input id="team-name-1" required :value="teamName1" :onchange="setPlayerName1" type="text"/>

                <label for="pawn-skin-player-1">Pion</label>
                
                <select id="pawn-skin-player-1"  @change="selectSkinPawnPlayer1">
                    <option v-for="name in pawnsConfigName" :value="name" :key="name"> {{name}} </option>
                </select>
                <PawnPreview player="player-1" :pawnSkinName="pawnSkinNamePlayer1" />
            </articles>

            <articles class="player">
                <h3>Joueur 2</h3>
                <label for="team-name-2">Nom de l'équipe</label>
                <input id="team-name-2" required :value="teamName2" :onchange="setPlayerName2" type="text"/>

                <label for="pawn-skin-player-1">Pion</label>
                
                <select id="pawn-skin-player-1" @change="selectSkinPawnPlayer2" >
                    <option v-for="name in pawnsConfigName" :value="name" :key="name"> {{name}} </option>
                </select>
                <PawnPreview player="player-2" :pawnSkinName="pawnSkinNamePlayer2" />
            </articles>

            <section class="game-presets">
                <label for="game-preset-option">Positionnnement de départ</label>
                <select id="game-preset-option" @change="selectPreset">
                    <option value=1 >Position 1</option>
                    <option value=2 >Position 2</option>
                    <option value=3 >Position 3</option>
                </select>
                <img class="game-presets-image" :src="imagePresetUrl" alt="image d'aide pour les règles" />
            
            </section>
            <section  class="game-mod">
              <h2>Mode de la partie</h2>
              <button :onclick="selectDistantMod" type="button" class="button-choice" :class="{['is-selected']: isDistantModSelected}">
                <p>Partie à distance</p>
                <img class="computeur-icon" src="/assets/screen-image.png" aria-hidden />
                <img class="computeur-icon" src="/assets/screen-image.png" aria-hidden />
              </button>
              <button :onclick="selectLocalMod" type="button" class="button-choice"  :class="{['is-selected']: !isDistantModSelected}">
                <p>Partie locale</p>
                <img class="computeur-icon" src="/assets/screen-image.png" alt="computeur image" />
              </button>
            </section>

          <div class="submit-container">
            <button v-if="!isLoading" type="submit" class="submit-button" > Créer la partie </button>
            <img v-else src="/assets/loading.gif" class="loading-icon">
          </div>
        </form>
    </section>

</template>

<style scoped>

input:invalid {
  border: 1px solid red;
}

.parameters-container {
    background-color: rgb(50, 49, 90);
    padding: 1rem;
    width: fit-content;  
}


.settings-form {
    display: grid;
    grid-gap: 5px;
    grid-template-areas: 
    "player1  preset"
    "player2  preset"
    "gameMod submit"
    ;
    grid-template-columns: 1fr 0.5fr;
    grid-template-rows: 1fr 1fr 0fr;


    .player:nth-child(1) {
        grid-area: player1;
    }
    
    .player:nth-child(2) {
        grid-area: player2;
    }

    .game-mod {
      grid-area: gameMod;
    }

  .submit-container {
    display: flex;
    justify-content: center;
    .submit-button {
      grid-area: submit;
      height: fit-content;
      max-width: 250px;
      margin: 1rem;
    }

    .loading-icon {
      width: 25px;
      height: 25px;
    }
  }

    .game-presets {
        grid-area: preset;
        display: flex;
        flex-direction: column;
        #game-preset-option {
            width: 100px;
        }

    }
            
    .game-presets-image {
      margin-top: 1rem;
      width: 150px;
    }

    .computeur-icon {
      width: 70px;
    }

    .button-choice {
      text-align: center;
      margin: 10px;
      padding: 1rem;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.5);
      border: 3px solid transparent;
    }

  .button-choice.is-selected {
    border-color: green;
  }

}
</style>