export interface KanbanCardType {
    id: string;
    title: string;
    description: string;
    columnId: KanbanColumnType["id"];
}

export interface KanbanColumnType {
    id: string;
    title: string;
    editedAt?: Date | null;
}

export interface KanbanBoardType {
    columns: KanbanColumnType[];
}