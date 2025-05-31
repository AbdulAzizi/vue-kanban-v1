export interface KanbanCardType {
    id: string;
    title: string;
    description: string;
    order: number;
}

export interface KanbanColumnType {
    id: string;
    title: string;
    order: number;
}

export interface KanbanBoardType {
    columns: KanbanColumnType[];
}