import {GanttTaskModel} from '../gantt-task.model';
import * as d3Path from 'd3-path';
import {D3SvgContainerUtilityService} from './d3-svg-container-utility.service';
import {Injectable} from '@angular/core';
import {D3TaskUtilityService} from './d3-task-utility.service';

@Injectable()
export class D3TaskDependencyUtility {

    public tasks: GanttTaskModel[];

    private readonly ARROW_HEIGHT = 10;
    private readonly ARROW_WIDTH  = 5;

    constructor(private svgContainer: D3SvgContainerUtilityService,
                private taskUtility: D3TaskUtilityService) {}

    public init(tasks: GanttTaskModel[]) {
        this.tasks = tasks;
    }

    public invalidate() {
        this.drawDependencies();
    }

    private drawDependencies() {
        const tasks = this.taskUtility.tasks
            .selectAll('.dependencies')
            .selectAll('path')
            .data((t: GanttTaskModel) => {
                const dependencies = this.getDependencies(t);
                return dependencies.map((d) => { return { dependency: d, task: t }; });
            })
            .enter();

        tasks.append('path').attr('d', (data) => this.createPath(data));
        tasks.append('path')
            .attr('class', 'arrow-head')
            .attr('d', (data) => this.createArrowPointer(data.task));
    }

    private createPath(data: {task: GanttTaskModel, dependency: GanttTaskModel }): any {
        const task = data.task;
        const dependency = data.dependency;

        const path = d3Path.path();

        path.moveTo(this.taskUtility.getTaskCenterX(dependency), this.taskUtility.getTaskEndY(dependency));
        path.lineTo(this.taskUtility.getTaskCenterX(dependency), this.taskUtility.getTaskCenterY(task));
        path.lineTo(this.taskUtility.getTaskStartX(task), this.taskUtility.getTaskCenterY(task));

        return path;
    }

    private createArrowPointer(task: GanttTaskModel): any {
        const path = d3Path.path();

        path.moveTo(this.taskUtility.getTaskStartX(task), this.taskUtility.getTaskCenterY(task));
        path.lineTo(this.taskUtility.getTaskStartX(task) - this.ARROW_WIDTH, this.taskUtility.getTaskCenterY(task) - this.ARROW_HEIGHT / 2);
        path.lineTo(this.taskUtility.getTaskStartX(task) - this.ARROW_WIDTH, this.taskUtility.getTaskCenterY(task) + this.ARROW_HEIGHT / 2);
        path.closePath();

        return path;
    }

    /** Return an array of tasks that describe task dependency */
    private getDependencies(task: GanttTaskModel): GanttTaskModel[] {
        task.dependencies = task.dependencies || [];

        return (task.dependencies as any[]).map((id) => {
            return this.tasks.find(t => t.id === id);
        });
    }
}
