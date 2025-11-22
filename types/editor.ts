// 에디터 데이터 타입 정의
export type EditorValue = TElement[];

export interface TElement {
	type: string;
	children: TNode[];
	id?: string;
	// 공통 속성
	align?: "left" | "center" | "right" | "justify";
	indent?: number;
	lineHeight?: string;
	// 타입별 추가 속성
	[key: string]: any;
}

export interface TText {
	text: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	code?: boolean;
	color?: string;
	backgroundColor?: string;
	fontSize?: string;
	highlight?: boolean;
}

export type TNode = TElement | TText;

// 특정 블록 타입 인터페이스
export interface ParagraphElement extends TElement {
	type: "p";
}

export interface HeadingElement extends TElement {
	type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface BlockquoteElement extends TElement {
	type: "blockquote";
}

export interface CodeBlockElement extends TElement {
	type: "code_block";
	lang?: string;
}

export interface ListElement extends TElement {
	type: "ul" | "ol";
}

export interface ListItemElement extends TElement {
	type: "li";
}

export interface TodoItemElement extends TElement {
	type: "todo_li";
	checked: boolean;
}

export interface ToggleElement extends TElement {
	type: "toggle";
}

export interface ColumnGroupElement extends TElement {
	type: "column_group";
}

export interface ColumnElement extends TElement {
	type: "column";
	width?: string;
}

export interface TableElement extends TElement {
	type: "table";
}

export interface TableRowElement extends TElement {
	type: "tr";
}

export interface TableCellElement extends TElement {
	type: "th" | "td";
}

export interface ImageElement extends TElement {
	type: "img";
	url: string;
	alt?: string;
	width?: string;
	height?: string;
}

export interface LinkElement extends TElement {
	type: "a";
	url: string;
}

export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	start: string; // ISO 8601
	end: string; // ISO 8601
	allDay?: boolean;
}

export interface CalendarElement extends TElement {
	type: "calendar";
	title?: string;
	events: CalendarEvent[];
}

export interface DdayElement extends TElement {
	type: "dday";
	title: string;
	description?: string;
	targetDate: string; // ISO 8601
}

export interface ColumnDefinition {
	id: number;
	name: string;
}

export interface DataTableElement extends TElement {
	type: "datatable";
	tid: string; // UUID
	name: string;
	columns: ColumnDefinition[];
	data: Record<string, string>[];
}

export interface PageLinkElement extends TElement {
	type: "pagelink";
	pageUrl: string; // UUID
	pageTitle: string;
}

export interface CalloutElement extends TElement {
	type: "callout";
	variant?: "info" | "warn" | "error" | "success";
	title?: string;
}