let GANTT_TASK_UNIQUE_ID = 1;

export interface GanttInputModel {
    id?: string|number;
    name: string;
    progress: number;

    createdOn: Date;
    dueTo: Date;
    dependencies?: number[] | string[];
}

export class GanttTaskModel {
    id?: string|number;
    name: string;
    progress: number;

    createdOn: Date;
    dueTo: Date;
    dependencies?: { key: string, value: string|number }[] | number[] | string[];

    /** Unique id that should not be altered.*/
    private _gUniqueId?: number;

    constructor(data: GanttInputModel) {
        Object.assign(this, data);
        this.gUniqueId = GANTT_TASK_UNIQUE_ID++;
    }

    public set gUniqueId(value: number) { this._gUniqueId = value; }
    public get gUniqueId(): number { return this._gUniqueId; }
}
