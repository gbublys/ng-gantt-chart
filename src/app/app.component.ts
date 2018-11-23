import { Component, OnInit } from '@angular/core';
import { GanttTaskModel } from '../lib/gantt-chart/gantt-task.model';
import * as data from './data.json';

@Component({
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public tasks: GanttTaskModel[];

    ngOnInit(): void {
        this.tasks = data.default;
    }

    public viewTask(task: GanttTaskModel) {
        console.log(task);
    }
}
