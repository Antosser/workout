import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { LICENSEComponent } from './components/license/license.component';
import { WorkoutComponent } from './components/workout/workout.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: ExercisesComponent,
  },
  {
    path: 'license',
    component: LICENSEComponent,
  },
  {
    path: 'workout',
    component: WorkoutComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
