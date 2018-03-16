import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {GanttTaskModel} from './gantt-task.model';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Path from 'd3-path';
import * as d3timeFormat from 'd3-time-format';

@Component({
  selector: 'ng-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttChartComponent implements OnInit {

  @Input() public tasks: GanttTaskModel[];

  public margin = {top: 1, right: 1, bottom: 30, left: 0};
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private svg: any;

  @Input() public cellHeight = 50;
  @Input() public cellWidth = 50;
  @Input() public dateFormat: string  = null;
  @Input() public vGrid = true;
  @Input() public hGrid = true;

  constructor() {
    this.width = window.innerWidth - this.margin.left - this.margin.right;
    this.height = window.innerHeight - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {
    this.initSvg();
    this.initAxis();

    this.drawGrid();
    this.drawTasks();
    this.drawAxis();

    this.drawRequirement(this.tasks[0], this.tasks[2]);
    this.drawRequirement(this.tasks[2], this.tasks[4]);
  }

  private initSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private initAxis() {
    this.xScale = d3Scale.scaleTime().range([0, this.getWidth()]);
    this.yScale = d3Scale.scaleBand().range([0, this.getHeight()]);

    this.xScale.domain([
      d3Array.min(this.tasks, (d) => d.createdOn),
      d3Array.max(this.tasks, (d) => d.dueTo),
    ]);

    this.yScale.domain(this.tasks.map((t) => t.name ));
  }

  private drawAxis() {
    this.drawXAxis();
  }

  private drawRequirement(requiredTask: GanttTaskModel, requiredTaskBy: GanttTaskModel) {
    // Create path.
    const path = d3Path.path();

    const curveX0 = (this.xScale(requiredTask.dueTo) - this.xScale(requiredTask.createdOn)) / 2 + this.xScale(requiredTask.createdOn);
    const curveY0 = this.yScale(requiredTaskBy.name);

    const curveX1 = curveX0 + this.cellHeight / 2;
    const curveY1 = curveY0 + this.cellHeight / 2;

    // Draw vertical line to requiredTaskBy.
    path.moveTo(curveX0, this.yScale(requiredTask.name) + this.cellHeight);
    path.lineTo(curveX0, curveY0);

    // Bend the curve
    path.bezierCurveTo(curveX0, curveY0 + this.cellHeight / 2, curveX1, curveY1, curveX1, curveY1);

    // Finish line to task.
    path.lineTo(this.xScale(requiredTaskBy.createdOn), this.yScale(requiredTaskBy.name) + this.cellHeight / 2);

    // Append arrow head.
    path.lineTo(this.xScale(requiredTaskBy.createdOn) - this.cellHeight / 10, this.yScale(requiredTaskBy.name) + this.cellHeight / 2.5);
    path.lineTo(this.xScale(requiredTaskBy.createdOn), this.yScale(requiredTaskBy.name) + this.cellHeight / 2);
    path.lineTo(this.xScale(requiredTaskBy.createdOn) - this.cellHeight / 10 , this.yScale(requiredTaskBy.name) + (this.cellHeight - this.cellHeight / 2.5));

    // Append line to graph
    this.svg
      .append('g')
      .attr('class', 'dependency')
      .append('path')
      .attr('d', path);
  }

  private drawXAxis() {
    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${ this.getHeight() })`)
      .call(d3Axis.axisBottom(this.xScale).ticks(this.getDateDiffInDays()).tickFormat(this.getDateFormat()));
  }

  /** Returns a user specified time format. If none was specified - a null will be returned. */
  private getDateFormat() {
    return this.dateFormat ? d3timeFormat.timeFormat(this.dateFormat) : null;
  }

  private drawGrid() {
    if (this.hGrid) {
      this.svg
        .append('g')
        .call( d3Axis.axisLeft(this.yScale).ticks(this.tasks.length).tickSize(-this.getWidth()).tickFormat('' as any) )
        .attr('transform', `translate(0, ${ -this.cellHeight / 2 })`)
        .attr('class', 'grid');
    }

    if (this.vGrid) {
      this.svg
        .append('g')
        .call(d3Axis.axisBottom(this.xScale).ticks(this.getDateDiffInDays()).tickSize(this.getHeight()).tickFormat('' as any))
        .attr('class', 'grid');
    }
  }

  private drawTasks() {
    const rectContainer = this.svg
      .append('g')
      .attr('class', 'task-list')
      .selectAll('rect')
      .data(this.tasks)
      .enter()
      .append('g')
      .attr('class', 'task');

    // Draw rectangles that describe overall progress.
    rectContainer.append('rect')
      .attr('class', 'task-bg')
      .attr('x', (d) => this.xScale(d.createdOn))
      .attr('y', (d) => this.yScale(d.name) + 2)
      .attr('ry', 3)
      .attr('height', (d) => this.yScale.bandwidth() - 5)
      .attr('width', (d) => this.xScale(d.dueTo) - this.xScale(d.createdOn));

    // Draw rectangles that describe actual progress.
    rectContainer.append('rect').attr('class', 'progress')
      .attr('x', (d) => this.xScale(d.createdOn))
      .attr('y', (d) => this.yScale(d.name) + 2)
      .attr('ry', 3)
      .attr('height', (d) => this.yScale.bandwidth() - 5)
      .attr('width', (d: GanttTaskModel) => (this.xScale(d.dueTo) - this.xScale(d.createdOn)) * d.progress / 100);

    // Add percentage
    rectContainer
      .append('text')
      .text((d) => `${ d.progress }%`);

    rectContainer
      .selectAll('text')
      .attr('x', (task: GanttTaskModel) => (this.xScale(task.dueTo) - this.xScale(task.createdOn)) / 2 + this.xScale(task.createdOn))
      .attr('y', (task: GanttTaskModel) => this.yScale(task.name) + this.cellHeight / 2);
  }

  private getHeight(): number {
    return this.tasks.length * this.cellHeight;
  }

  private getWidth(): number {
    return this.getDateDiffInDays() * this.cellWidth;
  }

  private getDateDiffInDays(): number {
    const minDate: Date = d3Array.min(this.tasks, (t) => t.createdOn);
    const maxDate: Date = d3Array.max(this.tasks, (t) => t.dueTo);

    const oneDay = 1000 * 60 * 60 * 24; // One day in milliseconds

    return Math.ceil((maxDate.getTime() - minDate.getTime()) / oneDay);
  }
}
