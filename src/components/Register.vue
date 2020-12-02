<script>
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
  export default {
    data: () => ({
      valid: false,
      showErrorAlert: false,
      errorMessage: '',
      showSuccessAlert: false,
      firstname: '',
      password: '',
      nameRules: [
        v => !!v || 'Name is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be 6 characters long',
        v => /[A-z]/.test(v) && /\d/.test(v) || 'Password must contain numbers and letters'
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }),
    methods: {
      submitRegister() {
        const errorAlert = (msg) => {
          this.errorMessage = msg
          this.showErrorAlert = true
          setTimeout(() => {
            this.showErrorAlert = false
          }, 5000)
        }
        if (!this.valid) {
          errorAlert('Sorry, please check the input values and try again')
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
      Success! Remember to open the email you just received to gain access to your validation code!
    </v-alert>
    <v-container>
      <h1>Register</h1>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Password"
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
          @click="submitRegister"
        >Submit
        </v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
