import { NgGanttTaskModel } from '../ng-gantt-task.model';
import * as d3Path from 'd3-path';
import { D3SvgContainerUtilityService } from './d3-svg-container-utility.service';
import { Injectable } from '@angular/core';
import { D3TaskUtilityService } from './d3-task-utility.service';
import { GanttTaskModel } from '../gantt-task.model';

@Injectable()
export class D3TaskDependencyUtility {

    private readonly ARROW_HEIGHT = 10;
    private readonly ARROW_WIDTH = 5;

    private test;

    constructor(private svgContainer: D3SvgContainerUtilityService,
        private taskUtility: D3TaskUtilityService) { }

    public init() {
        this.test = this.taskUtility.d3Tasks
            .selectAll('.gantt-dependencies')
            .selectAll('path')
            .data((t: NgGanttTaskModel) => {
                const dependencies = this.getDependencies(t);
                return dependencies.map((d) => {
                     return { dependency: d, task: t }; 
                });
            })
            .enter();

        this.test.append('path').attr('class', 'gantt-arrow-body');
        this.test.append('path').attr('class', 'gantt-arrow-head');
    }

    public invalidate() {
        this.drawDependencies();
    }

    private drawDependencies() {
        this.test.selectAll('.gantt-arrow-body')
            .transition().duration(50)
            .attr('d', (data) => this.createPath(data));

        this.test.selectAll('.gantt-arrow-head')
            .transition().duration(50)
            .attr('d', (data) => this.createArrowPointer(data.task));
    }

    private createPath(data: { task: NgGanttTaskModel, dependency: NgGanttTaskModel }): any {
        const task = data.task;
        const dependency = data.dependency;

        const path = d3Path.path();

        path.moveTo(this.taskUtility.getTaskCenterX(dependency), this.taskUtility.getTaskEndY(dependency));
        path.lineTo(this.taskUtility.getTaskCenterX(dependency), this.taskUtility.getTaskCenterY(task));
        path.lineTo(this.taskUtility.getTaskStartX(task), this.taskUtility.getTaskCenterY(task));

        return path;
    }

    private createArrowPointer(task: NgGanttTaskModel): any {
        const path = d3Path.path();

        path.moveTo(this.taskUtility.getTaskStartX(task), this.taskUtility.getTaskCenterY(task));
        path.lineTo(this.taskUtility.getTaskStartX(task) - this.ARROW_WIDTH, this.taskUtility.getTaskCenterY(task) - this.ARROW_HEIGHT / 2);
        path.lineTo(this.taskUtility.getTaskStartX(task) - this.ARROW_WIDTH, this.taskUtility.getTaskCenterY(task) + this.ARROW_HEIGHT / 2);
        path.closePath();

        return path;
    }

    /** Return an array of tasks that describe task dependency */
    private getDependencies(task: GanttTaskModel): GanttTaskModel[] {
        return task.parent ? [task.parent] : [];
        // task.dependencies = task.dependencies || [];

        // return (task.dependencies as any[]).map((id) => {
        //     return this.taskUtility.tasks.find(t => t.id === id);
        // });
    }
}
