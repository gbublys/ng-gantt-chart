import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {GanttTaskModel} from './gantt-task.model';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Path from 'd3-path';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GanttChartComponent implements OnInit {

  @Input() public tasks: GanttTaskModel[];

  public margin = {top: 1, right: 1, bottom: 30, left: 0};
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;

  public cellHeight = 50;

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
    this.x = d3Scale.scaleTime().range([0, this.getWidth()]);
    this.y = d3Scale.scaleBand().range([0, this.getHeight()]);

    this.x.domain([
      d3Array.min(this.tasks, (d) => d.createdOn),
      d3Array.max(this.tasks, (d) => d.dueTo),
    ]);

    this.y.domain(this.tasks.map((t) => t.name ));
  }

  private drawAxis() {
    this.drawXAxis();
  }

  private drawRequirement(requiredTask: GanttTaskModel, requiredTaskBy: GanttTaskModel) {
    // Create path.
    const path = d3Path.path();

    const curveX0 = (this.x(requiredTask.dueTo) - this.x(requiredTask.createdOn)) / 2 + this.x(requiredTask.createdOn);
    const curveY0 = this.y(requiredTaskBy.name);

    const curveX1 = curveX0 + 25;
    const curveY1 = curveY0 + 25;

    // Draw vertical line to requiredTaskBy.
    path.moveTo(curveX0, this.y(requiredTask.name) + 50);
    path.lineTo(curveX0, curveY0);

    // Bend the curve
    path.bezierCurveTo(curveX0, curveY0 + 25, curveX1, curveY1, curveX1, curveY1);

    // Finish line to task.
    path.lineTo(this.x(requiredTaskBy.createdOn), this.y(requiredTaskBy.name) + 25);

    // Append line to graph
    this.svg.append('g').append('path')
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'black');
  }

  private drawXAxis() {
    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${ this.getHeight() })`)
      .call(d3Axis.axisBottom(this.x).ticks(this.getDateDiffInDays()));
  }

  private drawGrid() {
    this.svg
      .append('g')
      .call( d3Axis.axisLeft(this.y).ticks(this.tasks.length).tickSize(-this.getWidth()).tickFormat('' as any) )
      .attr('transform', `translate(0, ${ -this.cellHeight / 2 })`)
      .attr('class', 'grid');


    this.svg
      .append('g')
      .call(d3Axis.axisBottom(this.x).ticks(this.getDateDiffInDays()).tickSize(this.getHeight()).tickFormat('' as any))
      .attr('class', 'grid');
  }

  private drawTasks() {
    this.svg
      .append('g')
      .attr('class', 'scrollable-container')
      .selectAll('rect')
      .data(this.tasks)
      .enter()
      .append('rect')
      .attr('class', 'task-rect')
      .attr('x', (d) => this.x(d.createdOn))
      .attr('y', (d) => this.y(d.name))
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('height', (d) => this.y.bandwidth())
      .attr('width', (d) => this.x(d.dueTo) - this.x(d.createdOn));
  }

  private getHeight(): number {
    return this.tasks.length * 50;
  }

  private getWidth(): number {
    return this.getDateDiffInDays() * 50;
  }

  private getDateDiffInDays(): number {
    const minDate: Date = d3Array.min(this.tasks, (t) => t.createdOn);
    const maxDate: Date = d3Array.max(this.tasks, (t) => t.dueTo);

    const oneDay = 1000 * 60 * 60 * 24;    // Convert both dates to milliseconds

    return Math.ceil((maxDate.getTime() - minDate.getTime()) / oneDay);

  }
}
