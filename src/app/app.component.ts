import {Component, OnInit} from '@angular/core';
import {GanttTaskModel} from '../lib/gantt-chart/gantt-task.model';

const Tasks: GanttTaskModel[] = [
    {
        startAt: '2014-03-08T12:00:00.000Z',
        dueTo: '2014-03-09T12:00:00.000Z',
        name: 'Task 1 A long title here',
        progress: 100,
        children: [
            {
                startAt: '2014-03-09T12:00:00.000Z',
                dueTo: '2014-03-11T12:00:00.000Z',
                name: 'Task 2',
                progress: 50,
            },
            {
                startAt: '2014-03-11T12:00:00.000Z',
                dueTo: '2014-03-12T15:00:00.000Z',
                name: 'Task 3',
                progress: 100,
                children: [
                    {
                        startAt: '2014-03-12T15:00:00.000Z',
                        dueTo: '2014-03-13T15:00:00.000Z',
                        name: 'Task 3.1',
                        progress: 50,
                    },
                ]
            },
        ]
    },
    {
        startAt: '2014-03-10T15:00:00.000Z',
        dueTo: '2014-03-14T12:00:00.000Z',
        name: 'Task 4',
        progress: 56
    },
    {
        startAt: '2014-03-09T15:00:00.000Z',
        dueTo: '2014-03-21T00:00:00.000Z',
        name: 'Task 5',
        progress: 32
    },
    {
        startAt: '2014-03-21T00:00:00.000Z',
        dueTo: '2014-04-01T00:00:00.000Z',
        name: 'Task 6',
        progress: 0
    },
    {
        startAt: '2014-03-20T00:00:00.000Z',
        dueTo: '2014-04-01T00:00:00.000Z',
        name: 'Task 7',
        progress: 1,
    },
    {
        startAt: '2014-03-18T00:00:00.000Z',
        dueTo: '2014-03-25T00:00:00.000Z',
        name: 'Task 8',
        progress: 5
    }
];

@Component({
    selector: 'ng-root',
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public tasks;

    ngOnInit(): void {
        this.tasks = Tasks;
    }

    public test($event) {
        console.log($event);
    }
}
