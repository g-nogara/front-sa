<script>
import axios from 'axios'
  export default {
    data: () => ({
      loading: false,
      showInfo: false,
      message: '',
      decks: [],
    }),
    mounted () {
      if (!sessionStorage.getItem('awsAccess')) {
        sessionStorage.clear()
        alert('It seems something went wrong with the app state. Please login again!')
        this.$router.push('/login')
      }
      try {
       axios.patch(`${process.env.VUE_APP_API_URL}api/deck/owner`, { accessToken: sessionStorage.getItem('awsAccess') })
      .then(res => {
        console.log(res)
      }).catch(() => {
        this.showInfo = true;
        this.message = 'Try saving your first deck!'
        setTimeout(() => {
          this.showInfo = false
        }, 3000)
      }) 
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>

<template>
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
          <v-icon v-text="deck.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="deck.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>