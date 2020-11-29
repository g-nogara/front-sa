<script>
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
  export default {
    data: () => ({
      valid: false,
      showErrorAlert: false,
      errorMessage: '',
      showSuccessAlert: false,
      code: '',
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }),
    methods: {
      submitCode() {
        const errorAlert = (msg) => {
          this.errorMessage = msg
          this.showErrorAlert = true
          setTimeout(() => {
            this.showErrorAlert = false
          }, 5000)
        }
        if (!this.valid) {
          errorAlert()
        }

        const userPool = new CognitoUserPool({ UserPoolId: process.env.VUE_APP_POOL_ID, ClientId: process.env.VUE_APP_CLIENT_ID })
        const emailAws = new CognitoUserAttribute({ Name: 'email', Value: this.email })
        const nameAws = new CognitoUserAttribute({ Name: 'custom:full_name', Value: this.firstname })

        userPool.signUp(this.email, this.password, [emailAws, nameAws], [], (err, result) => {
          if (err) {
            errorAlert(err.message)
          }
          console.log('result =>', result)
          if (result && result.user) {
            this.showSuccessAlert = true
            setTimeout(() => {
              this.showSuccessAlert = false
              window.location.href = 'login'
            }, 5000)
            //
          }
        })
      }
    }
  }
</script>

<template>
  <v-form v-model="valid">
    <v-alert v-if="showErrorAlert"
    type="error"
    transition="slide-x-transition"
    dismissible
    >
      {{ errorMessage }}
    </v-alert>
    <v-alert v-if="showSuccessAlert"
    type="success"
    transition="slide-x-transition"
    dismissible
    >
      Success! You can now log in to the app!
    </v-alert>
    <v-container>
      <h1>Register</h1>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="code"
            label="Verification Code"
            required
          ></v-text-field>
        </v-col>

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
      </v-row>
      <v-row
      justify="end">
        <v-btn
          color="primary"
          elevation="7"
          @click="submitcode"
        >Submit
        </v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
