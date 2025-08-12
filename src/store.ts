import { createStore } from 'vuex';
import { RequestService } from './services/request-service.ts';

export const store = createStore({
    state: {},
    mutations: {},
    actions: {
        createGame: async ( {} , payload:  {
            preset: number
            game_mod: string
            teams: {
                name: string
                pawns_skin: string
            }[]
        })  => {
            try {
               const gameId =  await RequestService.post('/games', payload)
               return gameId;
            } catch (err) {
                console.log(err)
            }
        },
    },
    getters: {}
}) 