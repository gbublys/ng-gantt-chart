import {GanttTaskModel} from '../gantt-task.model';
import * as d3Path from 'd3-path';
import * as d3Selection from 'd3-selection';
import {D3SvgContainerUtilityService} from './d3-svg-container-utility.service';
import {Injectable} from '@angular/core';
import {D3TaskUtilityService} from './d3-task-utility.service';
import {Path} from 'd3-path';

@Injectable()
export class D3TaskDependencyUtility {

    public tasks: GanttTaskModel[];

    private readonly ARROW_HEIGHT = 30;
    private readonly ARROW_WIDTH  = 30;

    constructor(private svgContainer: D3SvgContainerUtilityService,
                private taskUtility: D3TaskUtilityService) {}

    public init(tasks: GanttTaskModel[]) {
        this.tasks = tasks;
    }

    public invalidate() {
        this.drawDependencies();
    }

    private scaleX(value: any): number { return this.svgContainer.applyXScaling(value); }
    private scaleY(value: any): number { return this.svgContainer.applyYScaling(value); }

    private drawDependencies() {
        this.taskUtility.tasks
            .selectAll('.dependencies')
            .filter((t: GanttTaskModel) => !!t.dependencies)
            .data((t: GanttTaskModel) => {
                const dependencies = this.getDependencies(t);

                return dependencies.map(d => {
                    return { task: t, dependency: d };
                });
            })
            .append('path').attr('d', (data) => this.createPath(data));
    }

    private createPath(data: {task: GanttTaskModel, dependency: GanttTaskModel }): any {
        const task = data.task;
        const dependency = data.dependency;

        const path = d3Path.path();

        path.moveTo(this.getTaskCenterX(dependency), this.getTaskEndY(dependency));
        path.lineTo(this.getTaskCenterX(dependency), this.getTaskCenterY(task));
        path.lineTo(this.getTaskStartX(task), this.getTaskCenterY(task));

        return path;
    }

    /** Return an array of tasks that describe task dependency */
    private getDependencies(task: GanttTaskModel): GanttTaskModel[] {
        task.dependencies = task.dependencies || [];

        return [this.tasks[0]];
    }

    private getTaskCenterX(task: GanttTaskModel): number {
        return this.scaleX(task.createdOn) + (this.scaleX(task.dueTo) - this.scaleX(task.createdOn)) / 2;
    }

    private getTaskStartX(task: GanttTaskModel): number {
        return this.scaleX(task.createdOn);
    }

    private getTaskEndX(task: GanttTaskModel): number {
        return this.scaleX(task.dueTo);
    }

    private getTaskStartY(task: GanttTaskModel): number {
        return this.scaleY(task.name);
    }

    private getTaskCenterY(task: GanttTaskModel): number {
        return this.scaleY(task.name) + this.svgContainer.getCellHeight() / 2;
    }

    private getTaskEndY(task: GanttTaskModel): number {
        return this.scaleY(task.name) + this.svgContainer.getCellHeight();
    }
}
