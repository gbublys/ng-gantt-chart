export class GanttTaskModel {
    id?: string|number;
    name: string;
    progress: number;

    createdOn: Date;
    dueTo: Date;
    dependencies?: { key: string, value: string|number }[] | number[] | string[];
}
