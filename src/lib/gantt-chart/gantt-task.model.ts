let GANTT_TASK_UNIQUE_ID = 1;

export class GanttTaskModel {
    id?: string|number;
    name: string;
    progress: number;

    createdOn: Date;
    dueTo: Date;
    dependencies?: { key: string, value: string|number }[] | number[] | string[];

    /** Unique id that should not be altered.*/
    private _gUniqueId?: number;

    constructor(data) {
        Object.assign(this, data);
        this.gUniqueId = GanttTaskModel.getNetUniqueId();
    }

    public set gUniqueId(value: number) { this._gUniqueId = value; }
    public get gUniqueId(): number { return this._gUniqueId; }


    /** Generates a new unique id for GanttTaskModel to be tracked as Y axis. */
    static getNetUniqueId(): number {
        return GANTT_TASK_UNIQUE_ID++;
    }
}
