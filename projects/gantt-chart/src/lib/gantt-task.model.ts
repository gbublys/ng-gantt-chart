let GANTT_TASK_UNIQUE_ID = 0;
const GANTT_TASK_ID_MAP = {};

export class GanttTaskModel {
    name: string;
    progress: number;

    startAt?: Date | string;
    dueTo?: Date | string;
    duration?: Date| string;

    uniqueGanttId?: number;
    children?: GanttTaskModel[] = [];
    parent?: GanttTaskModel;

    constructor(data: GanttTaskModel, parent?: GanttTaskModel) {
        Object.assign(this, data);
        this.startAt = new Date(data.startAt as string);
        this.dueTo = new Date(data.dueTo as string);
        this.parent = parent;
        this.uniqueGanttId = GANTT_TASK_UNIQUE_ID++;
        this.children = this.children.map(child => new GanttTaskModel(child, this));
    }
}
