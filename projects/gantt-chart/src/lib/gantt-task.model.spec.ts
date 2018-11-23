import {GanttTaskModel} from './gantt-task.model';

describe('GanttTaskModel', () => {
    let ganttTaskData: GanttTaskModel;

    beforeEach(() => {
        ganttTaskData = {
            name: 'Task 1',
            startAt: new Date('2014-03-08T12:00:00.000Z'),
            dueTo: new Date('2014-03-09T12:00:00.000Z'),
            progress: 100
        };
    });

    it('should assign unique id per new gant task', () => {
        const task1 = new GanttTaskModel(ganttTaskData);
        const task2 = new GanttTaskModel(ganttTaskData);
        expect(task1.uniqueGanttId).not.toBe(task2.uniqueGanttId);
    });

    it('should initialise children', () => {
        ganttTaskData.children = [
            {
                name: 'Task 2',
                startAt: new Date('2014-03-08T12:00:00.000Z'),
                dueTo: new Date('2014-03-09T12:00:00.000Z'),
                progress: 100
            }
        ];

        const task = new GanttTaskModel(ganttTaskData);
        expect(task.children[0] instanceof GanttTaskModel).toBeTruthy();
    });

    it('child should know its parent', () => {
        ganttTaskData.children = [
            {
                name: 'Task 2',
                startAt: new Date('2014-03-08T12:00:00.000Z'),
                dueTo: new Date('2014-03-09T12:00:00.000Z'),
                progress: 100
            }
        ];

        const task = new GanttTaskModel(ganttTaskData);
        expect(task.children[0].parent.uniqueGanttId).toBe(task.uniqueGanttId);
    });
});
