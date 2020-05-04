import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const app = admin.initializeApp()
const db = app.firestore()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const resetReadWriteCounter = functions.pubsub
  .schedule('every day 00:00')
  .onRun(async (_context) => {
    const querySnapshot = await db.collection('users').get()
    querySnapshot.forEach(async (doc) => {
      try {
        await db.doc(`users/${doc.id}`).update({ read: 0, write: 0 })
      } catch (e) {}
    })
  })
