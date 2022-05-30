import { Component } from '@angular/core';

interface Exercise {
  name: string;
  duration: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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

  constructor() {
    // Local Storage
    this.streak = parseInt(localStorage.getItem('streak') as string) || 0;
    this.exercises = JSON.parse(localStorage.getItem('exercises') as string) || [{ name: 'Exercise', duration: 30 }];

    if (this.exercises.length === 0) {
      this.exercises.push({name: 'Exercise', duration: 30});
    }

    setInterval(() => {
      localStorage.setItem('streak', this.streak.toString());
      localStorage.setItem('exercises', JSON.stringify(this.exercises));
    }
    , 10);
  }
}