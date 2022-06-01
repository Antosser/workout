import { Injectable } from '@angular/core';

interface Exercise {
  name: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  lastExerciseDate: Date;
  title = 'workout-angular';
  streak = 0;
  exercises: Exercise[] = [];

  arrayMove(arr: any[], fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  moveUp(index: number) {
    this.arrayMove(this.exercises, index, index - 1);
  }

  moveDown(index: number) {
    this.arrayMove(this.exercises, index, index + 1);
  }

  addStreak() {
    // Add to steak if last exercise was not today
    if (this.lastExerciseDate.getDate() !== new Date().getDate()) {
      this.streak++;
      this.lastExerciseDate = new Date();
      return true;
    }
    return false;
  }

  reset() {
    this.exercises = [{ name: 'Exercise', duration: 30 }];
  }

  constructor() {
    // Local Storage
    this.streak = parseInt(localStorage.getItem('streak') as string) || 0;
    this.exercises = JSON.parse(localStorage.getItem('exercises') as string) || [{ name: 'Exercise', duration: 30 }];
    this.lastExerciseDate = new Date(localStorage.getItem('lastExerciseDate') as string) || new Date('01/01/1970');

    if (this.exercises.length === 0) {
      this.reset();
    }

    setInterval(() => {
      localStorage.setItem('streak', this.streak.toString());
      localStorage.setItem('exercises', JSON.stringify(this.exercises));
      localStorage.setItem('lastExerciseDate', this.lastExerciseDate.toString());

      // Reset streak if last exercise was before yesterday
      if (this.lastExerciseDate.getDate() < new Date().getDate() - 1) {
        this.streak = 0;
      }
    }
    , 10);
  }
}
