import {Injectable} from '@angular/core';
import * as d3Selection from 'd3-selection';

@Injectable()
export class D3SvgContainerUtilityService {

    public svg;

    /** Real svg container. */
    public svgContainer;

    public xScale;
    public yScale;

    public init(selector: string) {
        d3Selection.select('g').remove();
        this.svgContainer = d3Selection.select(selector);
        this.svg = this.svgContainer.append('g');
    }

    public applyMargin(margin: { left: number; top: number; right: number; bottom: number; }) {
        this.svg.attr('transform', `translate(${ margin.left }, ${ margin.top })`);
    }

    public applyXScaling(i: any): number {
        return this.xScale(i);
    }

    public applyYScaling(i: any): number {
        return this.yScale(i);
    }

    public getCellHeight(): number {
        return this.yScale.bandwidth();
    }

}
