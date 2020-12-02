<script>
import axios from 'axios'
  export default {
    data: () => ({
      loading: false,
      showInfo: false,
      message: '',
      decks: [],
    }),
    components: {
      ModalDeck: () => import('./ModalDeck')
    },
    mounted () {
      if (!sessionStorage.getItem('awsAccess')) {
        sessionStorage.clear()
        alert('It seems something went wrong with the app state. Please login again!')
        this.$router.push('/login')
      }
      try {
       axios.patch(`${process.env.VUE_APP_API_URL}api/deck/owner`, { accessToken: sessionStorage.getItem('awsAccess') })
      .then(res => {
        this.decks = res.data
      }).catch(() => {
        this.message = 'Try saving your first deck!'
        this.showInfo = true
        setTimeout(() => {
          this.showInfo = false
        }, 3000)
      }) 
      } catch (error) {
        console.log(error)
      }
    },
    methods: {
      deleteDeck (deckId) {
        axios.delete(`${process.env.VUE_APP_API_URL}api/deck/${deckId}`)
        .then(() => {
          this.decks = this.decks.filter((deck => deck._id != deckId))
          this.message = 'Removed!'
          this.showInfo = true
          setTimeout(() => {
            this.showInfo = false
          }, 2500)
        })
      },
      routeToEdit (deckid) {
        this.$router.push({ name: 'deck', params: { deckid } })
      }
    },
  }
</script>

<template>
<div>
   <modal-deck />
   <br>
  <v-card
    class="mx-auto"
    max-width="600"
    tile
  >
  <v-alert :value="showInfo"
    type="info"
    transition="slide-x-transition"
    dismissible
    >
      {{ message }}
    </v-alert>
    
    <v-list shaped>
      <v-subheader>
        Decks
      </v-subheader>
      <v-list-item
        v-for="(deck, i) in decks"
        :key="i"
      >
        <v-list-item-icon>
          <v-icon v-text="deck.titulo"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="deck.descricao"></v-list-item-title>
        </v-list-item-content>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="info"
            @click="routeToEdit(deck._id)"
          >
          <v-icon>
            mdi-cards
          </v-icon>
        </v-btn>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="warning"
            @click="deleteDeck(deck._id)"
          >
          <v-icon>
            mdi-delete-outline
          </v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</div>
</template>