import { ExerciseService } from './exercises.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private exerciseService: ExerciseService,
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }


  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user as User);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData(user: User) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      lastExerciseDate: this.exerciseService.lastExerciseDate.toISOString(),
      streak: this.exerciseService.streak,
      exercises: JSON.stringify(this.exerciseService.exercises),
    };

    return userRef.set(data, { merge: true });
  }

  public uploadData() {
    // Upload data to firestore database
    if (firebase.auth().currentUser !== null) {
      this.afs.collection('users').doc(firebase.auth().currentUser?.uid).set({
        lastExerciseDate: this.exerciseService.lastExerciseDate.toISOString(),
        streak: this.exerciseService.streak,
        exercises: JSON.stringify(this.exerciseService.exercises),
      }, { merge: true });
    } else {
      console.error('Failed to upload data')
    }
  }

  public downloadData() {
    // Download data from firestore database
    if (firebase.auth() !== null) {
      this.afs.collection('users').doc(firebase.auth().currentUser?.uid).get().subscribe(doc => {
        if (doc.exists) {
          this.exerciseService.lastExerciseDate = new Date((doc.data() as User).lastExerciseDate as string);
          this.exerciseService.streak = (doc.data() as User).streak as number;
          this.exerciseService.exercises = JSON.parse((doc.data() as User).exercises as string);
        } else {
          console.error('Failed to download data');
        }
      }
      );
    } else {
      console.error('Failed to download data')
    }
  }
}
