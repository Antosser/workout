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
  streak = 0;
  exercises: Exercise[] = [];

  constructor() {
    // Local Storage
    this.streak = parseInt(localStorage.getItem('streak') as string) || 0;
    this.exercises = JSON.parse(localStorage.getItem('exercises') as string) || [{name: '', duration: 30 }];
    this.lastExerciseDate = new Date(localStorage.getItem('lastExerciseDate') as string) || new Date('01/01/1970');

    this.save();

    if (this.exercises.length === 0) {
      this.reset();
    }

    setInterval(() => {
      this.save();
    }
    , 10);
  }

  getDays(date: Date) {
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24) + date.getTimezoneOffset() / 24);
  }

  arrayMove(arr: any[], fromIndex: number, toIndex: number) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  moveUp(index: number) {
    this.arrayMove(this.exercises, index, index - 1);
    this.save();
  }

  moveDown(index: number) {
    this.arrayMove(this.exercises, index, index + 1);
    this.save();
  }

  addStreak() {
    // Add to steak if last exercise was not today
    if (this.getDays(this.lastExerciseDate) !== this.getDays(new Date())) {
      this.streak++;
      this.lastExerciseDate = new Date();
      this.save();
      return true;
    }
    return false;
  }

  reset() {
    this.exercises = [{ name: '', duration: 30 }];
    this.save();
  }

  save() {
    localStorage.setItem('streak', this.streak.toString());
    localStorage.setItem('exercises', JSON.stringify(this.exercises));
    localStorage.setItem('lastExerciseDate', this.lastExerciseDate.toString());

    // Reset streak if last exercise was before yesterday
    if (this.getDays(this.lastExerciseDate) < this.getDays(new Date()) - 1) {
      this.streak = 0;
    }
  }

}
