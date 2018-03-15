import {Component} from '@angular/core';
import {GanttTaskModel} from './gantt-chart/gantt-task.model';

const Tasks: GanttTaskModel[] = [
  {
    createdOn: new Date('2014-03-08T12:00:00.000Z'),
    dueTo: new Date('2014-03-09T12:00:00.000Z'),
    name: 'Task 1 A long title here',
    progress: 100
  },
  {
    createdOn: new Date('2014-03-09T12:00:00.000Z'),
    dueTo: new Date('2014-03-11T12:00:00.000Z'),
    name: 'Task 2',
    progress: 100
  },
  {
    createdOn: new Date('2014-03-11T12:00:00.000Z'),
    dueTo: new Date('2014-03-12T15:00:00.000Z'),
    name: 'Task 3',
    progress: 100
  },
  {
    createdOn: new Date('2014-03-12T15:00:00.000Z'),
    dueTo: new Date('2014-03-18T12:00:00.000Z'),
    name: 'Task 4',
    progress: 56
  },
  {
    createdOn: new Date('2014-03-12T15:00:00.000Z'),
    dueTo: new Date('2014-03-21T00:00:00.000Z'),
    name: 'Task 5',
    progress: 32
  },
  {
    createdOn: new Date('2014-03-21T00:00:00.000Z'),
    dueTo: new Date('2014-04-21T00:00:00.000Z'),
    name: 'Task 6 A long title here as well',
    progress: 0
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public tasks = Tasks;
}
