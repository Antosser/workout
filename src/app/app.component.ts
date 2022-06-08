import { Component } from '@angular/core';

interface Exercise {
  name: string;
  duration: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor() {

  }
}
