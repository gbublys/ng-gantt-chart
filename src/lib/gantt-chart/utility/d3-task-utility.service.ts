import {Injectable} from '@angular/core';
import {GanttTaskModel} from '../gantt-task.model';
import {Selection} from 'd3-selection';
import {D3SvgContainerUtilityService} from './d3-svg-container-utility.service';

let GANT_TASK_UNIQUE_ID = 1;

@Injectable()
export class D3TaskUtilityService {

    tasks: Selection<any, any, any, any>;

    constructor(private chartContainer: D3SvgContainerUtilityService) {}

    /** Initialises tasks */
    public initTasks(svg: Selection<any, any, any, any>, tasks: GanttTaskModel[]) {
        tasks = tasks.map(t => {
            t['gUniqueId'] = GANT_TASK_UNIQUE_ID++;
            return t;
        });

        this.tasks = svg.append('g')
            .attr('class', 'task-list')
            .selectAll('rect')
            .data(tasks)
            .enter()
            .append('g').attr('class', 'task'); // Create a task container

        this.tasks.append('g').attr('class', 'dependencies'); // Create a placeholder for dependency arrows.
        this.tasks.append('rect').attr('class', 'task-bg'); // Create a placeholder for estimation
        this.tasks.append('rect').attr('class', 'progress'); // Create a placeholder for progress
        this.tasks.append('text'); // Create a placeholder for text
    }

    /** Updates all tasks - their position, progress, text */
    public invalidate() {
        const scaleX = (i) => this.chartContainer.applyXScaling(i);
        const scaleY = (i) => this.chartContainer.applyYScaling(i);

        this.tasks.selectAll('.task-bg')
            .attr('x', (d: GanttTaskModel) => scaleX(d.createdOn))
            .attr('y', (d: GanttTaskModel) => scaleY(d.name) + 2)
            .attr('ry', 3)
            .attr('height', (d) => this.chartContainer.getCellHeight() - 5)
            .attr('width', (d: GanttTaskModel) => scaleX(d.dueTo) - scaleX(d.createdOn));

        this.tasks.selectAll('.progress')
            .attr('x', (d: GanttTaskModel) => scaleX(d.createdOn))
            .attr('y', (d: GanttTaskModel) => scaleY(d.name) + 2)
            .attr('ry', 3)
            .attr('height', (d) => this.chartContainer.getCellHeight() - 5)
            .attr('width', (d: GanttTaskModel) => (scaleX(d.dueTo) - scaleX(d.createdOn)) * d.progress / 100);

        this.tasks
            .selectAll('text')
            .text((d: GanttTaskModel) => `${ d.progress }%`)
            .attr('x', (task: GanttTaskModel) => (scaleX(task.dueTo) - scaleX(task.createdOn)) / 2 + scaleX(task.createdOn))
            .attr('y', (task: GanttTaskModel) => scaleY(task.name) + this.chartContainer.getCellHeight() / 2);

    }
}
