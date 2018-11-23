import {Injectable} from '@angular/core';
import {NgGanttTaskModel} from '../ng-gantt-task.model';
import {D3SvgContainerUtilityService} from './d3-svg-container-utility.service';
import {GanttTaskModel} from '../gantt-task.model';

@Injectable()
export class D3TaskUtilityService {

    public _tasks: NgGanttTaskModel[] = [];
    public d3Tasks: any;
    public taskMargin = { left: 0, top: 2, bottom: 3, right: 0 };

    constructor(private chartContainer: D3SvgContainerUtilityService) {}

    public set tasks(value: GanttTaskModel[]) {
        const uniqueTaskMap = {};
        const flatMapTasks = (tasks: GanttTaskModel[]) => {
            tasks.forEach(t => {
                uniqueTaskMap[t.uniqueGanttId] = t;

                flatMapTasks(t.children);
            });
        };
        flatMapTasks(value);

        const uniqueTasks = [];

        for (const key in uniqueTaskMap) {
            if (uniqueTaskMap.hasOwnProperty(key)) {
                uniqueTasks.push(uniqueTaskMap[key]);
            }
        }

        this._tasks = uniqueTasks;
    }

    public get tasks(): GanttTaskModel[] { return this._tasks; }

    /** Initialises tasks */
    public init() {
        this.d3Tasks = this.chartContainer.svg.append('g')
            .attr('class', 'gantt-task-list')
            .selectAll('rect')
            .data(this.tasks)
            .enter()
            .append('g').attr('class', 'gantt-task'); // Create a task container

        this.d3Tasks.append('g').attr('class', 'gantt-dependencies'); // Create a placeholder for dependency arrows.
        this.d3Tasks.append('rect').attr('class', 'gantt-task-bg'); // Create a placeholder for estimation
        this.d3Tasks.append('rect').attr('class', 'gantt-progress'); // Create a placeholder for progress
        this.d3Tasks.append('text'); // Create a placeholder for text
    }

    /** Updates all tasks - their position, progress, text */
    public invalidate() {
        const scaleX = (i) => this.chartContainer.applyXScaling(i);
        const scaleY = (i) => this.chartContainer.applyYScaling(i);

        this.d3Tasks.selectAll('.gantt-task-bg')
            .transition().duration(50)
            .attr('x', (t: NgGanttTaskModel) => this.getTaskStartX(t))
            .attr('y', (t: NgGanttTaskModel) => this.getTaskStartY(t))
            .attr('ry', 3)
            .attr('height', (t) => this.chartContainer.getCellHeight() - this.taskMargin.top - this.taskMargin.bottom)
            .attr('width', (t: NgGanttTaskModel) => {
                const width = Math.max(0, this.getTaskEndX(t) - this.getTaskStartX(t));
                return width;
            });

        this.d3Tasks.selectAll('.gantt-progress')
            .transition().duration(50)
            .attr('x', (t: NgGanttTaskModel) => this.getTaskStartX(t))
            .attr('y', (t: NgGanttTaskModel) => this.getTaskStartY(t))
            .attr('ry', 3)
            .attr('height', (t) => this.chartContainer.getCellHeight() - this.taskMargin.top - this.taskMargin.bottom)
            .attr('width', (d: NgGanttTaskModel) => (scaleX(d.dueTo) - scaleX(d.startAt)) * d.progress / 100);

        this.d3Tasks.selectAll('text')
            .transition().duration(50)
            .text((d: NgGanttTaskModel) => `${ d.progress }%`)
            .attr('x', (task: NgGanttTaskModel) => (scaleX(task.dueTo) - scaleX(task.startAt)) / 2 + scaleX(task.startAt))
            .attr('y', (task: GanttTaskModel) => scaleY(task.uniqueGanttId) + this.chartContainer.getCellHeight() / 2);
    }


    public scaleX(value: any): number { return this.chartContainer.applyXScaling(value); }
    public scaleY(value: any): number { return this.chartContainer.applyYScaling(value); }

    public getTaskCenterX(task: NgGanttTaskModel): number {
        return this.scaleX(task.startAt) + (this.scaleX(task.dueTo) - this.scaleX(task.startAt)) / 2;
    }

    public getTaskStartX(task: NgGanttTaskModel): number {
        return this.scaleX(task.startAt) + this.taskMargin.left;
    }

    public getTaskEndX(task: NgGanttTaskModel): number {
        return this.scaleX(task.dueTo);
    }

    public getTaskStartY(task: GanttTaskModel): number {
        return this.scaleY(task.uniqueGanttId) + this.taskMargin.top;
    }

    public getTaskCenterY(task: GanttTaskModel): number {
        return this.scaleY(task.uniqueGanttId) + this.chartContainer.getCellHeight() / 2;
    }

    public getTaskEndY(task: GanttTaskModel): number {
        return this.scaleY(task.uniqueGanttId) + this.chartContainer.getCellHeight() - this.taskMargin.bottom;
    }
}
