<script>
import axios from 'axios';
  export default {
    data: () => ({
      modalDeck: false,
      deckName: '',
      deckDescription: '',
      deckLegal: '',
      loading: false,
      showSuccessAlert: false,
    }),
    methods: {
      async saveDeck () {
        const saveAlert = () => {
          this.showSuccessAlert = true
          setTimeout(() => {
            this.showSuccessAlert = false
          }, 5000)
        }
        this.loading = true
        const body = {};
        [[this.deckName, 'titulo'], [this.deckDescription, 'descricao'], [this.deckLegal, 'formato']].map(p => {
          if (!p[0]) return
          body[p[1]] = p[0]
        })
        body.accessToken = sessionStorage.getItem('awsAccess')
        await axios.post(`${process.env.VUE_APP_API_URL}api/deck/`, body)
        .then(() => {
          saveAlert()
          this.modalDeck = false
          this.loading = false
          location.reload()
        })
        .catch(err => {
          if (err.message) console.log(err.message)
          this.loading = false
        })
      }
    }
  }
</script>

<template>
  <v-row justify="start">
    <v-alert :value="showSuccessAlert"
    type="success"
    transition="slide-x-transition"
    dismissible
    >
      Success!
    </v-alert>
    <v-dialog
      v-model="modalDeck"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :loading=loading
          color="info"
          x-large
          v-bind="attrs"
          v-on="on"
        >
          New Deck
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">New Deck</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Name*"
                  required
                  v-model="deckName"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  label="Description"
                  hint="Small description of the deck"
                  v-model="deckDescription"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  :items="['none', 'standard', 'brawl', 'commander', 'legacy', 'vintage']"
                  label="Format legal"
                  v-model="deckLegal"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="modalDeck = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveDeck"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>