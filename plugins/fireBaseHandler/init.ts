import * as firebase from 'firebase/app'
import 'firebase/firestore/memory'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig)

export const firebaseApp = firebase
export const db = firebase.firestore()
export const auth = firebase.auth()

if (window.location.hostname === 'localhost') {
  db.settings({
    host: 'localhost:8080',
    ssl: false
  })
}
