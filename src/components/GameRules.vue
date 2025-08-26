<script setup lang="ts">
import {ref} from "vue";

const shouldDisplayRules = ref<boolean>(true);
function handleRulesDisplay () {
  shouldDisplayRules.value = !shouldDisplayRules.value;
}
</script>

<template>
  <div class="rules-container">
    <button class="display-button" :onclick="handleRulesDisplay">
      <p v-if="shouldDisplayRules"> Cacher les règle</p>
      <p v-else >Afficher les règle</p>
      <img class="arrow-icon" src="/assets/arrow-down-icon.png" :class="{up: shouldDisplayRules}" />
    </button>
    <section :class="{'is-hidden': !shouldDisplayRules}">
        <h2>Règles du jeu</h2>
        <ul>
            <li>Déplacement:
                <ol>
                    <li>Un pions se d'éplace d'autant de cases que d'autres pions adjacents, diagonales comprises, alié ou enemie compris.</li>
                    <li>Un déplacement se fait que dans une direction linéaire (ortho / diagonal)</li>
                    <li>Un déplacement ne peut pas passer au dessus d'un pion allié/adverse</li>
                </ol>
            </li>
        </ul>
        <img src="/assets/topcap-tuto.png" alt="image d'aide pour les règles" />
      <h2>Conditions de vicoitre</h2>
      <ul>
        <li>Placer un de ses pion sur la case roi de l'adversaire pour gagner</li>
        <li>Ladversaire ne peux pas jouer lors de son tour</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>

.display-button {
  display: flex;
  align-items: center;
  gap: 1rem;

  .arrow-icon {
    height: 15px;
  }

  .arrow-icon.up {
    transform: rotate(-180deg);
  }
}

section.is-hidden {
  overflow: hidden;
  height: 0;
}


</style>