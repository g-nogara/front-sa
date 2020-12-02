<script>
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global'
  export default {
    data: () => ({
      valid: false,
      showErrorAlert: false,
      loadingLogin: false,
      errorMessage: '',
      showSuccessAlert: false,
      password: '',
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }),
    methods: {
      login() {
        return new Promise((resolve, reject) => {
          this.loadingLogin = true
          const errorAlert = (msg) => {
          this.errorMessage = msg
          this.showErrorAlert = true
          setTimeout(() => {
            this.showErrorAlert = false
          }, 5000)
        }
        if (!this.valid) {
          errorAlert('Por favor confira os dados preenchidos e as dicas de que aparecem abaixo do campo!')
          this.loadingLogin = false
          reject('Failed to login')
        }

        const authenticationData = {
          Username: this.email,
          Password: this.password
        }
        const authenticationDetails = new AuthenticationDetails(authenticationData)

        const userPool = new CognitoUserPool({ UserPoolId: process.env.VUE_APP_POOL_ID, ClientId: process.env.VUE_APP_CLIENT_ID })
        const userData = {
          Username: this.email,
          Pool: userPool
        }
        const cognitoUser = new CognitoUser(userData)
        cognitoUser.authenticateUser(authenticationDetails, {

          onFailure: (err) => {
            errorAlert(err.message)
            this.loadingLogin = false
            reject()
          },

          onSuccess: (result) => {
            const accessToken = result.getAccessToken().getJwtToken();
            const refreshToken = result.getRefreshToken().getToken();
            AWS.config.region = process.env.VUE_APP_REGION
            const cognitoURI = `cognito-idp.${process.env.VUE_APP_REGION}.amazonaws.com/${process.env.VUE_APP_POOL_ID}`
            const Logins = {}
            Logins[cognitoURI] = result.getIdToken().getJwtToken()

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
              IdentityPoolId: process.env.VUE_APP_IDENTITY_ID,
              Logins
            })

            AWS.config.credentials.refresh(error => {
              if (error) {
                errorAlert(error.message)
                this.loadingLogin = false
                reject(error)
              }
            })
            sessionStorage.setItem('awsAccess', accessToken)
            sessionStorage.setItem('awsRefresh', refreshToken)
            this.showSuccessAlert = true
            this.loadingLogin = false
            setTimeout(() => {
              this.showSuccessAlert = false
              this.$router.push('/home')
              location.reload()
            }, 5000)
            resolve(result)

          }
        })
        })
      }
    }
  }
</script>

<template>
  <v-form v-model="valid">
    <v-alert :value="showErrorAlert"
    type="error"
    transition="slide-x-transition"
    dismissible
    >
      {{ errorMessage }}
    </v-alert>
    <v-alert :value="showSuccessAlert"
    type="success"
    transition="slide-x-transition"
    dismissible
    >
      Success! You will soon be redirected to the app!
    </v-alert>
    <v-container>
      <h1>Login</h1>
      <v-row>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="password"
            label="Password"
            required
          ></v-text-field>
        </v-col>

      </v-row>
      <v-row
      justify="end">
        <v-btn
          color="primary"
          elevation="7"
          @click="login"
          :loading="loadingLogin"
        >Login
        </v-btn>
        <div class="divisor" />
        <v-btn
          color="primary"
          elevation="7"
          @click="() => this.$router.push('/register')"
        >Sign up
        </v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<style scoped>
.divisor {
  width: 1rem;
  height: 4rem;
  content: '';
}
</style>
