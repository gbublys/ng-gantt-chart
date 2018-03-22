import {Injectable} from '@angular/core';
import {GanttTaskModel} from '../gantt-task.model';
import {Selection} from 'd3-selection';
import {D3SvgContainerUtilityService} from './d3-svg-container-utility.service';

@Injectable()
export class D3TaskUtilityService {

    public tasks: GanttTaskModel[] = [];
    public d3Tasks: Selection<any, GanttTaskModel, any, any>;
    public taskMargin = { left: 0, top: 2, bottom: 3, right: 0 };

    constructor(private chartContainer: D3SvgContainerUtilityService) {}

    public static GetDependencies(task: GanttTaskModel, tasks: GanttTaskModel[]) {
        /** Return an array of tasks that describe task dependency */
        task.dependencies = task.dependencies || [];

        return (task.dependencies as any[]).map((id) => {
            return tasks.find(t => t.id === id);
        });

    }

    /** Initialises tasks */
    public init() {
        this.d3Tasks = this.chartContainer.svg.append('g')
            .attr('class', 'task-list')
            .selectAll('rect')
            .data(this.tasks)
            .enter()
            .append('g').attr('class', 'task'); // Create a task container

        this.d3Tasks.append('g').attr('class', 'dependencies'); // Create a placeholder for dependency arrows.
        this.d3Tasks.append('rect').attr('class', 'task-bg'); // Create a placeholder for estimation
        this.d3Tasks.append('rect').attr('class', 'progress'); // Create a placeholder for progress
        this.d3Tasks.append('text'); // Create a placeholder for text
    }

    /** Updates all tasks - their position, progress, text */
    public invalidate() {
        const scaleX = (i) => this.chartContainer.applyXScaling(i);
        const scaleY = (i) => this.chartContainer.applyYScaling(i);

        this.d3Tasks.selectAll('.task-bg')
            .transition().duration(50)
            .attr('x', (t: GanttTaskModel) => this.getTaskStartX(t))
            .attr('y', (t: GanttTaskModel) => this.getTaskStartY(t))
            .attr('ry', 3)
            .attr('height', (t) => this.chartContainer.getCellHeight() - this.taskMargin.top - this.taskMargin.bottom)
            .attr('width', (t: GanttTaskModel) => this.getTaskEndX(t) - this.getTaskStartX(t));

        this.d3Tasks.selectAll('.progress')
            .transition().duration(50)
            .attr('x', (t: GanttTaskModel) => this.getTaskStartX(t))
            .attr('y', (t: GanttTaskModel) => this.getTaskStartY(t))
            .attr('ry', 3)
            .attr('height', (t) => this.chartContainer.getCellHeight() - this.taskMargin.top - this.taskMargin.bottom)
            .attr('width', (d: GanttTaskModel) => (scaleX(d.dueTo) - scaleX(d.startAt)) * d.progress / 100);

        this.d3Tasks.selectAll('text')
            .transition().duration(50)
            .text((d: GanttTaskModel) => `${ d.progress }%`)
            .attr('x', (task: GanttTaskModel) => (scaleX(task.dueTo) - scaleX(task.startAt)) / 2 + scaleX(task.startAt))
            .attr('y', (task: GanttTaskModel) => scaleY(task.gUniqueId) + this.chartContainer.getCellHeight() / 2);
    }


    public scaleX(value: any): number { return this.chartContainer.applyXScaling(value); }
    public scaleY(value: any): number { return this.chartContainer.applyYScaling(value); }

    public getTaskCenterX(task: GanttTaskModel): number {
        return this.scaleX(task.startAt) + (this.scaleX(task.dueTo) - this.scaleX(task.startAt)) / 2;
    }

    public getTaskStartX(task: GanttTaskModel): number {
        return this.scaleX(task.startAt) + this.taskMargin.left;
    }

    public getTaskEndX(task: GanttTaskModel): number {
        return this.scaleX(task.dueTo);
    }

    public getTaskStartY(task: GanttTaskModel): number {
        return this.scaleY(task.gUniqueId) + this.taskMargin.top;
    }

    public getTaskCenterY(task: GanttTaskModel): number {
        return this.scaleY(task.gUniqueId) + this.chartContainer.getCellHeight() / 2;
    }

    public getTaskEndY(task: GanttTaskModel): number {
        return this.scaleY(task.gUniqueId) + this.chartContainer.getCellHeight() - this.taskMargin.bottom;
    }
}
