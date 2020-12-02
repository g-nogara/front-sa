<script>
import mtg from "mtgsdk";
import axios from "axios";
export default {
  data() {
    return {
      cardInput: "",
      loadingSearch: false,
      loadingSave: false,
      fetchDeck: {},
      foundCards: [],
      cardsInDeck: [],
      showErrorAlert: false,
      showSuccessAlert: false,
      errorMessage: "",
      successMessage: "",
      itemsPerPageArray: [5, 10, 20, 50, 100],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 20,
      sortBy: "name",
      keys: ["Name", "cmc", "imageUrl"],
      items: [],
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name");
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    searchMtgApi(cardName) {
      this.page = 1;
      this.loadingSearch = true;
      mtg.card
        .where({ name: cardName })
        .then((res) => {
          if (res.length > 0) this.items = res.filter((card) => card.imageUrl);
          this.loadingSearch = false;
        })
        .catch(() => {
          this.loadingSearch = false;
          this.errorMessage = "Sorry, could not find anything";
          this.showErrorAlert = true;
          setTimeout(() => {
            this.showErrorAlert = false;
          }, 5000);
        });
    },
    addToDeck(card) {
      this.cardsInDeck.push({
        name: card.name,
        cmc: card.cmc,
        img: card.imageUrl,
      });
    },
    saveDeck() {
      this.loadingSave = true
      const updatedDeck = {
        cards: this.cardsInDeck,
        ...this.fetchDeck
      }
      axios.put(`${process.env.VUE_APP_API_URL}api/deck/${this.$route.params.deckid}`, updatedDeck)
      .then((data) => {
        console.log(data)
        this.loadingSave = false
        this.successMessage = 'Saved!';
        this.showSuccessAlert = true;
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 5000);
        })
      .catch(err => {
        this.loadingSearch = false;
        this.errorMessage = err.mesage;
        this.showErrorAlert = true;
        setTimeout(() => {
          this.showErrorAlert = false;
        }, 5000);
      })
    },
    removeCard(index) {
      this.cardsInDeck.splice(index, 1);
    },
  },
  async created() {
    const getDeck = async () => {
      const result = await axios.get(
        `${process.env.VUE_APP_API_URL}api/deck/${this.$route.params.deckid}`
      );
      return result.data;
    };
    this.fetchDeck = await getDeck();
    this.cardsInDeck = this.fetchDeck.cards;
  },
};
</script>

<template>
  <v-container fluid>
    <v-alert
      :value="showErrorAlert"
      type="error"
      transition="slide-x-transition"
      dismissible
    >
      {{ errorMessage }}
    </v-alert>
    <v-alert
      :value="showSuccessAlert"
      type="success"
      transition="slide-x-transition"
      dismissible
    >
      {{ successMessage }}
    </v-alert>
    <v-row align="center">
      <v-col cols="12" sm="4" key="1">
        <v-card class="mx-auto" max-width="600" outlined rounded="xl">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">
                Card search
              </div>
            </v-list-item-content>
          </v-list-item>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="cardInput"
              label="Card name"
              clearable
            ></v-text-field>
          </v-col>

          <v-card-actions>
            <v-btn
              rounded
              color="info"
              @click="searchMtgApi(cardInput)"
              :loading="loadingSearch"
            >
              Search
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- List cards -->
      <v-col cols="12" sm="4" key="2">
        <v-card
          class="mx-auto"
          max-width="600"
          outlined
          rounded="xl"
          :key="cardsInDeck.length + 10"
        >
          <h1 style="padding:5px; margin-left:5px;">Cards in deck</h1>
          <v-btn class="mx-2" dark color="green" :loading="loadingSave" @click="saveDeck">
            Save
            <v-icon dark>
              mdi-heart
            </v-icon>
          </v-btn>
          <v-simple-table dense height="210px">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    CMC
                  </th>
                  <th class="text-left">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cardboard, i) in cardsInDeck" :key="i">
                  <td>{{ cardboard.name }}</td>
                  <td>{{ cardboard.cmc }}</td>
                  <td>
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      small
                      color="pink"
                      @click="removeCard(i)"
                    >
                      <v-icon dark>
                        mdi-delete-outline
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <br />
    <v-data-iterator
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark color="blue darken-3" class="mb-1" rounded="xl">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            rounded
            prepend-inner-icon="mdi-magnify"
            label="Search among the found cards"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys.filter(key => key != 'imageUrl')"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
              rounded
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory rounded>
              <v-btn large depressed color="blue" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="blue" :value="true" rounded>
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title class="subheading font-weight-bold">
                {{ item.name }}
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  color="info"
                  @click="addToDeck(item)"
                >
                  <v-icon dark>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content
                    v-if="key != 'imageUrl'"
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{ key }}:
                  </v-list-item-content>
                  <v-list-item-content
                    v-if="key != 'imageUrl'"
                    class="align-end"
                    :class="{ 'blue--text': sortBy === key }"
                  >
                    {{ item[key.toLowerCase()] }}
                  </v-list-item-content>
                  <v-img v-else :src="item[key]"> </v-img>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>
