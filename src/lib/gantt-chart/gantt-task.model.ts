let GANTT_TASK_UNIQUE_ID = 1;

export interface GanttInputModel {
    id?: string|number;
    name: string;
    progress: number;

    startAt?: Date;
    dueTo?: Date;
    duration?: Date;
    dependencies?: number[] | string[];
}

export class GanttTaskModel {
    public id?: string|number;
    public name: string;
    public progress: number;

    public _startAt?: Date;
    public duration?: Date;
    public dueTo: Date;
    public dependencies?: { key: string, value: string|number }[] | number[] | string[];

    /** Unique id that should not be altered.*/
    private _gUniqueId?: number;

    constructor(data: GanttInputModel) {
        Object.assign(this, data);
        this.gUniqueId = GANTT_TASK_UNIQUE_ID++;

        this.invalidate();
    }

    public set startAt(value: Date) {
        this._startAt = value;
        this.invalidate();
    }
    public get startAt(): Date { return this._startAt; }

    public set gUniqueId(value: number) { this._gUniqueId = value; }
    public get gUniqueId(): number { return this._gUniqueId; }

    /** Refreshes task values */
    public invalidate() {
        if (this.duration) {
            this.dueTo = new Date(this._startAt.getTime() + this.duration.getTime());
        }
    }
}
