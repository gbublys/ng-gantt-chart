import {Component} from '@angular/core';
import {GanttTaskModel} from '../lib/gantt-chart/gantt-task.model';

const Tasks: GanttTaskModel[] = [
    new GanttTaskModel({
        id: 1,
        createdOn: new Date('2014-03-08T12:00:00.000Z'),
        dueTo: new Date('2014-03-09T12:00:00.000Z'),
        name: 'Task 1 A long title here',
        progress: 100
    }),
    new GanttTaskModel({
        id: 2,
        createdOn: new Date('2014-03-09T12:00:00.000Z'),
        dueTo: new Date('2014-03-11T12:00:00.000Z'),
        name: 'Task 2',
        progress: 100
    }),
    new GanttTaskModel({
        id: 3,
        createdOn: new Date('2014-03-11T12:00:00.000Z'),
        dueTo: new Date('2014-03-12T15:00:00.000Z'),
        name: 'Task 3',
        progress: 100,
        dependencies: [
            1, 2
        ]
    }),
    new GanttTaskModel({
        id: 4,
        createdOn: new Date('2014-03-12T15:00:00.000Z'),
        dueTo: new Date('2014-03-18T12:00:00.000Z'),
        name: 'Task 4',
        progress: 56
    }),
    new GanttTaskModel({
        id: 5,
        createdOn: new Date('2014-03-12T15:00:00.000Z'),
        dueTo: new Date('2014-03-21T00:00:00.000Z'),
        name: 'Task 5',
        progress: 32
    }),
    new GanttTaskModel({
        id: 6,
        createdOn: new Date('2014-03-21T00:00:00.000Z'),
        dueTo: new Date('2014-04-21T00:00:00.000Z'),
        name: 'Task 6',
        progress: 0
    }),
    new GanttTaskModel({
        id: 7,
        createdOn: new Date('2014-03-21T00:00:00.000Z'),
        dueTo: new Date('2014-04-21T00:00:00.000Z'),
        name: 'Task 7',
        progress: 0
    }),
    new GanttTaskModel({
        id: 8,
        createdOn: new Date('2014-03-18T00:00:00.000Z'),
        dueTo: new Date('2014-03-25T00:00:00.000Z'),
        name: 'Task 8',
        progress: 5
    }),
];

@Component({
    selector: 'ng-root',
    template: '<ng-gantt-chart [tasks]="tasks" (taskClick)="test($event)"></ng-gantt-chart>',
    styleUrls: ['./app.component.scss'],
    styles: [
        '::ng-deep .task-list { width: 100px; white-space: nowrap; overflow: hidden;}'
    ]
})
export class AppComponent {
    public tasks = Tasks;

    public test(task) {
        console.log(task);
    }
}
