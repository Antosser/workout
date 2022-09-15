import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
admin.initializeApp();

// const db = admin.firestore();

export const createUser = functions.auth.user().onCreate((user) => {
  admin
    .firestore()
    .doc('users/' + user.uid)
    .set({
      uid: user.uid,
      email: user.email,
      exercises: '[]',
      lastExerciseDate: '2022-1-1',
      streak: 0,
    });
});
