import {TestBed} from '@angular/core/testing';
import {D3AxisUtilityService} from './d3-axis-utility.service';
import * as d3Scale from 'd3-scale';
import * as d3Axis from 'd3-axis';

describe('D3AxisUtilityService', () => {

    let axisService: D3AxisUtilityService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ D3AxisUtilityService ]
        });
    });

    beforeEach(() => {
        axisService = TestBed.get(D3AxisUtilityService);
    });

    it('Should do something', () => {
        expect(axisService).toBeTruthy();

        const scale = d3Scale.scaleTime().domain([
            new Date('2014-03-08T00:00:00.000Z'),
            new Date('2014-03-01T00:00:00.000Z')
        ]).range([0 , 1000]);
    });

});
