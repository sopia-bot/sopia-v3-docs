"use client";

import React, { createContext, useContext } from "react";
import type { TElement, TText, TNode } from "@/types/editor";

// Create context for userId
const UserIdContext = createContext<string | undefined>(undefined);

export function useUserId() {
	return useContext(UserIdContext);
}
import {
	ParagraphElement,
	HeadingElement,
	BlockquoteElement,
	CodeBlockElement,
	ListElement,
	ListItemElement,
	TodoItemElement,
	ToggleElement,
	ColumnGroupElement,
	ColumnElement,
	TableElement,
	TableRowElement,
	TableCellElement,
	ImageElement,
	LinkElement,
	CalendarElement,
	DdayElement,
	DataTableElement,
	PageLinkElement,
	CalloutElement,
} from "./block-elements";

interface ContentRendererProps {
	data: TNode[];
	userId?: string;
}

export function ContentRenderer({ data, userId }: ContentRendererProps) {
	return (
		<UserIdContext.Provider value={userId}>
			<div className="prose prose-slate dark:prose-invert max-w-none">
				{data.map((node, index) => (
					<React.Fragment key={index}>
						{renderNode(node, userId)}
					</React.Fragment>
				))}
			</div>
		</UserIdContext.Provider>
	);
}

function renderNode(node: TNode, userId?: string): React.ReactNode {
	// 텍스트 노드인 경우
	if ("text" in node) {
		return renderTextNode(node as TText);
	}

	// Element 노드인 경우
	const element = node as TElement;

	switch (element.type) {
		case "p":
			return <ParagraphElement {...element} />;
		case "h1":
		case "h2":
		case "h3":
		case "h4":
		case "h5":
		case "h6":
			return <HeadingElement {...element} />;
		case "blockquote":
			return <BlockquoteElement {...element} />;
		case "code_block":
			return <CodeBlockElement {...element} />;
		case "ul":
		case "ol":
			return <ListElement {...element} />;
		case "li":
			return <ListItemElement {...element} />;
		case "lic":
			// List item content - just render children
			return <>{element.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child, userId)}</React.Fragment>
			))}</>;
		case "todo_li":
			return <TodoItemElement {...(element as any)} />;
		case "toggle":
			return <ToggleElement {...(element as any)} />;
		case "column_group":
			return <ColumnGroupElement {...element} />;
		case "column":
			return <ColumnElement {...(element as any)} />;
		case "table":
			return <TableElement {...element} />;
		case "tr":
			return <TableRowElement {...element} />;
		case "th":
		case "td":
			return <TableCellElement {...element} />;
		case "img":
			return <ImageElement {...(element as any)} />;
		case "a":
			return <LinkElement {...(element as any)} />;
		case "calendar":
			return <CalendarElement {...(element as any)} />;
		case "dday":
			return <DdayElement {...(element as any)} />;
		case "datatable":
			return <DataTableElement {...(element as any)} />;
		case "pagelink":
			return <PageLinkElement {...(element as any)} />;
		case "callout":
			return <CalloutElement {...(element as any)} />;
		case "code_line":
			// Code line - just render children with newline
			return (
				<>
					{element.children.map((child, i) => (
						<React.Fragment key={i}>{renderNode(child, userId)}</React.Fragment>
					))}
					{"\n"}
				</>
			);
		default:
			// Unknown type - render children
			console.warn(`Unknown element type: ${element.type}`);
			return (
				<div>
					{element.children.map((child, i) => (
						<React.Fragment key={i}>{renderNode(child, userId)}</React.Fragment>
					))}
				</div>
			);
	}
}

function renderTextNode(node: TText): React.ReactNode {
	let text: React.ReactNode = node.text;

	// 빈 텍스트는 zero-width space로 처리
	if (text === "") {
		text = "\u200B";
	}

	// 줄바꿈 처리
	if (typeof text === "string" && text.includes("\n")) {
		const lines = text.split("\n");
		text = lines.map((line, i) => (
			<React.Fragment key={i}>
				{i > 0 && <br />}
				{line}
			</React.Fragment>
		));
	}

	// 텍스트 스타일 적용
	text = applyTextStyles(text, node);

	return text;
}

function applyTextStyles(
	text: React.ReactNode,
	node: TText,
): React.ReactNode {
	let result = text;

	// 굵게
	if (node.bold) {
		result = <strong>{result}</strong>;
	}

	// 기울임
	if (node.italic) {
		result = <em>{result}</em>;
	}

	// 밑줄
	if (node.underline) {
		result = <u>{result}</u>;
	}

	// 취소선
	if (node.strikethrough) {
		result = <s>{result}</s>;
	}

	// 인라인 코드
	if (node.code) {
		result = <code className="px-1.5 py-0.5 bg-muted rounded text-sm">{result}</code>;
	}

	// 형광펜
	if (node.highlight) {
		result = <mark className="bg-yellow-200 dark:bg-yellow-800">{result}</mark>;
	}

	// 색상 적용
	const style: React.CSSProperties = {};
	if (node.color) {
		style.color = node.color;
	}
	if (node.backgroundColor) {
		style.backgroundColor = node.backgroundColor;
	}
	if (node.fontSize) {
		style.fontSize = node.fontSize;
	}

	if (Object.keys(style).length > 0) {
		result = <span style={style}>{result}</span>;
	}

	return result;
}

// Export renderNode for use in child components
export { renderNode };
