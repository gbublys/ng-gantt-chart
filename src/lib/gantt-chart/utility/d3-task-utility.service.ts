import {Inject, Injectable} from '@angular/core';
import {GanttTaskModel} from '../gantt-task.model';
import {Selection} from 'd3-selection';
import {CHART_CONTAINER_PROVIDER, ChartContainer} from "../gantt-chart.component";

@Injectable()
export class D3TaskUtilityService {

    tasks: Selection<any, any, any, any>;

    constructor(@Inject(CHART_CONTAINER_PROVIDER) private chartContainer: ChartContainer) {}

    /** Initialises tasks */
    public initTasks(svg: Selection<any, any, any, any>, tasks: GanttTaskModel[]) {
        this.tasks = svg.append('g')
            .attr('class', 'task-list')
            .selectAll('rect')
            .data(tasks)
            .enter()
            .append('g').attr('class', 'task'); // Create a task container

        this.tasks.append('rect').attr('class', 'task-bg'); // Create a placeholder for estimation
        this.tasks.append('rect').attr('class', 'progress'); // Create a placeholder for progress
        this.tasks.append('text'); // Create a placeholder for text
    }

    /** Updates all tasks - their position, progress, text */
    public invalidate() {
        this.tasks.selectAll('.task-bg')
            .attr('x', (d: GanttTaskModel) => this.chartContainer.applyXScaling(d.createdOn))
            .attr('y', (d: GanttTaskModel) => this.chartContainer.applyYScaling(d.name) + 2)
            .attr('ry', 3)
            .attr('height', (d) => 50 - 5)
            .attr('width', (d: GanttTaskModel) => this.chartContainer.applyXScaling(d.dueTo) - this.chartContainer.applyXScaling(d.createdOn));
    }
}
