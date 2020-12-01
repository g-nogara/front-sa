<script>
export default {
  name: 'App',
  computed: {
    hasAccess () {
      return !!sessionStorage.getItem('awsAccess')
    }
  }
};
</script>

<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
    <v-icon color="black">
      mdi-skull
    </v-icon>
    <v-icon color="white">
      mdi-white-balance-sunny
    </v-icon>
    <v-icon color="cyan">
      mdi-water
    </v-icon>
    <v-icon color="green">
      mdi-tree
    </v-icon>
    <v-icon color="red">
      mdi-fire
    </v-icon>
    <h1>Shibuya</h1>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
        <v-navigation-drawer
            absolute
            permanent
            expand-on-hover
          >
          <v-list
              nav
              dense
            >
            <v-list-item v-if="!hasAccess" to="login">
              <v-list-item-icon>
                <v-icon>mdi-login</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="!hasAccess" to="register">
              <v-list-item-icon>
                <v-icon>mdi-fountain-pen-tip</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="!hasAccess" to="validate">
              <v-list-item-icon>
                <v-icon>mdi-code-tags-check</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Validate code</v-list-item-title>
            </v-list-item>

            <v-list-item v-if="hasAccess" to="home">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>

          </v-list>
        </v-navigation-drawer>

        <div class="ma-12 pa-12">
          <router-view></router-view>
        </div>
    </v-main>
  </v-app>
</template>
