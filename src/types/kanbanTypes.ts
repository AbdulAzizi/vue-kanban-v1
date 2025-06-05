export interface KanbanCardType {
    id: string;
    title: string;
    description: string;
    columnId: KanbanColumnType["id"];
}

export interface KanbanColumnType {
    id: string;
    title: string;
}

export interface KanbanBoardType {
    columns: KanbanColumnType[];
}