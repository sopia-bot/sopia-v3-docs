"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useUserId } from "./content-renderer";
import type {
	TElement,
	TodoItemElement as TodoItemType,
	ToggleElement as ToggleType,
	ColumnElement as ColumnType,
	ImageElement as ImageType,
	LinkElement as LinkType,
	CalendarElement as CalendarType,
	CalendarEvent,
	DdayElement as DdayType,
	DataTableElement as DataTableType,
	PageLinkElement as PageLinkType,
	CalloutElement as CalloutType,
	CodeBlockElement as CodeBlockType,
	TText,
} from "@/types/editor";
import { renderNode } from "./content-renderer";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	flexRender,
	type ColumnDef,
	type SortingState,
	type ColumnFiltersState,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	format,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	addDays,
	addMonths,
	subMonths,
	isSameMonth,
	isSameDay,
	isWeekend,
	getDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Callout } from "fumadocs-ui/components/callout";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

// 단락 (Paragraph)
export function ParagraphElement(props: TElement) {
	const style: React.CSSProperties = {};

	if (props.align) {
		style.textAlign = props.align;
	}

	if (props.indent) {
		style.paddingLeft = `${props.indent * 40}px`;
	}

	if (props.lineHeight) {
		style.lineHeight = props.lineHeight;
	}

	return (
		<p style={style} className="my-4">
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</p>
	);
}

// 제목 (Heading)
export function HeadingElement(props: TElement) {
	const Tag = props.type as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	const style: React.CSSProperties = {};

	if (props.align) {
		style.textAlign = props.align;
	}

	return (
		<Tag style={style} className="font-bold my-6">
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</Tag>
	);
}

// 인용문 (Blockquote)
export function BlockquoteElement(props: TElement) {
	return (
		<blockquote className="border-l-4 border-muted-foreground pl-4 py-2 my-4 bg-muted/30 rounded-r">
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</blockquote>
	);
}

// 코드 블록 (Code Block)
export function CodeBlockElement(props: CodeBlockType) {
	// code_line들에서 텍스트 추출
	const extractCodeText = (children: any[]): string => {
		return children
			.map((child) => {
				if (child.type === "code_line") {
					// code_line의 children에서 text 추출
					return child.children
						.map((textNode: TText) => {
							if ("text" in textNode) {
								return textNode.text;
							}
							return "";
						})
						.join("");
				}
				return "";
			})
			.join("\n");
	};

	const code = extractCodeText(props.children);
	const lang = props.lang || "plaintext";

	return (
		<div className="my-4">
			<DynamicCodeBlock lang={lang} code={code} />
		</div>
	);
}

// 리스트 (List)
export function ListElement(props: TElement) {
	const Tag = props.type === "ol" ? "ol" : "ul";
	const className =
		props.type === "ol"
			? "list-decimal list-inside my-4 space-y-2"
			: "list-disc list-inside my-4 space-y-2";

	return (
		<Tag className={className}>
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</Tag>
	);
}

// 리스트 항목 (List Item)
export function ListItemElement(props: TElement) {
	return (
		<li className="ml-4">
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</li>
	);
}

// 할 일 목록 (Todo)
export function TodoItemElement(props: TodoItemType) {
	const [isChecked, setIsChecked] = useState(props.checked || false);

	return (
		<div className="flex items-start gap-2 my-2">
			<input
				type="checkbox"
				checked={isChecked}
				onChange={(e) => setIsChecked(e.target.checked)}
				className="mt-1 rounded border-gray-300"
			/>
			<span
				className={isChecked ? "line-through text-muted-foreground" : ""}
			>
				{props.children.map((child, i) => (
					<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
				))}
			</span>
		</div>
	);
}

// 토글 (Toggle)
export function ToggleElement(props: ToggleType) {
	const [isOpen, setIsOpen] = useState(false);

	// 첫 번째 자식은 항상 보이는 제목
	const title = props.children[0];
	// 나머지는 토글 가능한 내용
	const content = props.children.slice(1);

	return (
		<div className="my-4 border border-border rounded-lg">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors"
			>
				<span className="text-sm">{isOpen ? "▼" : "▶"}</span>
				<div className="flex-1 text-left">
					{renderNode(title)}
				</div>
			</button>
			{isOpen && (
				<div className="px-3 pb-3 pl-9">
					{content.map((child, i) => (
						<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
					))}
				</div>
			)}
		</div>
	);
}

// 컬럼 그룹 (Column Group)
export function ColumnGroupElement(props: TElement) {
	return (
		<div className="flex flex-col md:flex-row gap-4 my-6">
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</div>
	);
}

// 컬럼 (Column)
export function ColumnElement(props: ColumnType) {
	return (
		<div
			style={{ width: props.width || "100%" }}
			className="min-h-[50px] p-4 border border-dashed border-border rounded-lg"
		>
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</div>
	);
}

// 표 (Table)
export function TableElement(props: TElement) {
	const style: React.CSSProperties = {
		borderCollapse: "collapse",
	};

	// width 속성 적용
	if (props.width) {
		style.width = typeof props.width === "number" ? `${props.width}px` : props.width;
	} else {
		style.width = "100%";
	}

	// marginLeft 속성 적용
	if (props.marginLeft) {
		style.marginLeft = typeof props.marginLeft === "number" ? `${props.marginLeft}px` : props.marginLeft;
	}

	return (
		<div className="overflow-x-auto my-4">
			<table style={style} className="border border-border">
				<tbody>
					{props.children.map((child, i) => (
						<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
					))}
				</tbody>
			</table>
		</div>
	);
}

// 표 행 (Table Row)
export function TableRowElement(props: TElement) {
	const style: React.CSSProperties = {};

	// height 또는 size 속성 적용
	const height = props.height || props.size;
	if (height) {
		style.height = typeof height === "number" ? `${height}px` : height;
	}

	return (
		<tr style={Object.keys(style).length > 0 ? style : undefined}>
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</tr>
	);
}

// 표 셀 (Table Cell)
export function TableCellElement(props: TElement) {
	const Tag = props.type === "th" ? "th" : "td";
	const style: React.CSSProperties = {};
	
	// 기본 className (배경색이 없을 때만 기본 배경 적용)
	let className = "border border-border px-3 py-2 text-left";
	if (props.type === "th") {
		className = "border border-border px-3 py-2 font-bold text-left";
	}

	// backgroundColor 또는 background 속성 적용
	if (props.backgroundColor) {
		style.backgroundColor = props.backgroundColor as string;
	} else if (props.background) {
		style.background = props.background as string;
	} else if (props.type === "th") {
		// 배경색이 지정되지 않은 헤더는 기본 배경 적용
		className += " bg-muted";
	}

	// border 관련 속성 적용
	if (props.borderColor) {
		style.borderColor = props.borderColor as string;
	}
	if (props.borderWidth) {
		const width = typeof props.borderWidth === "number" ? `${props.borderWidth}px` : props.borderWidth;
		style.borderWidth = width;
	}
	if (props.borderStyle) {
		style.borderStyle = props.borderStyle as string;
	}

	// 개별 border 속성 (Plate.js 형식)
	if (props.borderTop) {
		style.borderTop = props.borderTop as string;
	}
	if (props.borderRight) {
		style.borderRight = props.borderRight as string;
	}
	if (props.borderBottom) {
		style.borderBottom = props.borderBottom as string;
	}
	if (props.borderLeft) {
		style.borderLeft = props.borderLeft as string;
	}

	// width와 height 속성 적용
	if (props.width) {
		style.width = typeof props.width === "number" ? `${props.width}px` : props.width;
	}
	if (props.height) {
		style.height = typeof props.height === "number" ? `${props.height}px` : props.height;
	}

	// colSpan과 rowSpan 속성
	const colSpan = props.colSpan as number | undefined;
	const rowSpan = props.rowSpan as number | undefined;

	// vertical-align 속성
	if (props.verticalAlign) {
		style.verticalAlign = props.verticalAlign as string;
	}

	// text-align 속성
	if (props.textAlign) {
		style.textAlign = props.textAlign as React.CSSProperties["textAlign"];
	}

	return (
		<Tag 
			className={className}
			style={Object.keys(style).length > 0 ? style : undefined}
			colSpan={colSpan}
			rowSpan={rowSpan}
		>
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</Tag>
	);
}

// 이미지 (Image)
// DJ Board 이미지 노드 구조 지원: initialWidth, initialHeight, isUpload, name 필드
// fumadocs-ui의 ImageZoom 컴포넌트를 사용하여 클릭 시 확대 가능
export function ImageElement(props: ImageType) {
	const containerStyle: React.CSSProperties = {};

	if (props.align) {
		if (props.align === "center") {
			containerStyle.display = "flex";
			containerStyle.justifyContent = "center";
		} else if (props.align === "right") {
			containerStyle.display = "flex";
			containerStyle.justifyContent = "flex-end";
		}
	}

	// DJ Board 업로드 이미지: initialWidth/initialHeight 사용
	// 기존 이미지: width/height 사용
	const rawWidth = props.width ?? props.initialWidth;
	const rawHeight = props.height ?? props.initialHeight;

	const width = typeof rawWidth === "string" ? parseInt(rawWidth, 10) || undefined : rawWidth;
	const height = typeof rawHeight === "string" ? parseInt(rawHeight, 10) || undefined : rawHeight;

	// width/height가 없는 경우 fill 모드 사용
	const hasDimensions = width && height;

	return (
		<div style={containerStyle} className="my-4">
			{hasDimensions ? (
				<ImageZoom
					src={props.url}
					alt={props.alt || props.name || ""}
					width={width}
					height={height}
					className="rounded-lg"
					style={{ maxWidth: "100%", height: "auto" }}
				/>
			) : (
				<div className="relative w-full" style={{ maxWidth: width || "100%" }}>
					<ImageZoom
						src={props.url}
						alt={props.alt || props.name || ""}
						fill
						className="rounded-lg !relative !h-auto !w-full"
						sizes="(max-width: 768px) 100vw, 800px"
					/>
				</div>
			)}
		</div>
	);
}

// 링크 (Link)
export function LinkElement(props: LinkType) {
	return (
		<a
			href={props.url}
			target="_blank"
			rel="noopener noreferrer"
			className="text-primary underline hover:text-primary/80"
		>
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</a>
	);
}

// 캘린더 (Calendar) - 커스텀 구현
export function CalendarElement(props: CalendarType) {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	// 달력 날짜 생성
	const calendarDays = useMemo(() => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart, { locale: ko });
		const endDate = endOfWeek(monthEnd, { locale: ko });

		const days = [];
		let day = startDate;

		while (day <= endDate) {
			days.push(day);
			day = addDays(day, 1);
		}

		return days;
	}, [currentDate]);

	// 특정 날짜에 해당하는 이벤트 찾기
	const getEventsForDate = (date: Date) => {
		return props.events.filter((event) => {
			const eventStart = new Date(event.start);
			eventStart.setHours(0, 0, 0, 0);
			const eventEnd = new Date(event.end);
			eventEnd.setHours(23, 59, 59, 999);
			const checkDate = new Date(date);
			checkDate.setHours(12, 0, 0, 0);
			return checkDate >= eventStart && checkDate <= eventEnd;
		});
	};

	// 이벤트가 시작하는 날인지 확인 (또는 주의 첫날)
	const isEventStart = (event: CalendarEvent, date: Date, dayIndex: number) => {
		const eventStart = new Date(event.start);
		eventStart.setHours(0, 0, 0, 0);
		const checkDate = new Date(date);
		checkDate.setHours(0, 0, 0, 0);
		
		// 이벤트가 실제로 시작하는 날이거나, 일요일(주의 시작)인 경우
		return isSameDay(eventStart, checkDate) || dayIndex === 0;
	};

	// 이벤트가 끝나는 날인지 확인
	const isEventEnd = (event: CalendarEvent, date: Date) => {
		const eventEnd = new Date(event.end);
		return isSameDay(eventEnd, date);
	};

	// 해당 날짜부터 이벤트가 며칠간 지속되는지 계산 (최대 주말까지)
	const getEventSpan = (event: CalendarEvent, date: Date, dayIndex: number) => {
		const eventStart = new Date(event.start);
		eventStart.setHours(0, 0, 0, 0);
		const eventEnd = new Date(event.end);
		eventEnd.setHours(23, 59, 59, 999);
		
		// 이 날짜부터 계산 시작
		let currentDate = new Date(date);
		currentDate.setHours(12, 0, 0, 0);
		
		let span = 0;
		let currentDayIndex = dayIndex;
		
		// 해당 주의 마지막 날(토요일)이나 이벤트 끝날까지 계산
		while (currentDayIndex < 7 && currentDate <= eventEnd) {
			span++;
			currentDate = addDays(currentDate, 1);
			currentDayIndex++;
		}
		
		return span;
	};

	// 주 단위로 날짜 그룹화
	const weeks = useMemo(() => {
		const weeksArray = [];
		for (let i = 0; i < calendarDays.length; i += 7) {
			weeksArray.push(calendarDays.slice(i, i + 7));
		}
		return weeksArray;
	}, [calendarDays]);

	const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

	return (
		<>
			<div className="my-8 border border-border rounded-2xl overflow-hidden bg-background shadow-lg">
				<div className="p-3 md:p-6">
					{/* 헤더 */}
					{/* 헤더 */}
					<div className="flex items-center justify-between mb-6 gap-2">
						<div className="flex items-center gap-2 shrink-0">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-foreground w-5 h-5 md:w-6 md:h-6"
							>
								<title>Calendar</title>
								<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
								<line x1="16" x2="16" y1="2" y2="6" />
								<line x1="8" x2="8" y1="2" y2="6" />
								<line x1="3" x2="21" y1="10" y2="10" />
							</svg>
							<h3 className="text-base md:text-xl font-bold mt-0 mb-0 whitespace-nowrap">
								{props.title || "캘린더 제목"}
							</h3>
						</div>

						<div className="flex items-center gap-1 md:gap-3">
							<button
								type="button"
								onClick={() => setCurrentDate(subMonths(currentDate, 1))}
								className="p-1 md:p-2 hover:bg-muted rounded-lg transition-colors"
								aria-label="이전 달"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="w-4 h-4 md:w-5 md:h-5"
								>
									<title>Previous</title>
									<polyline points="15 18 9 12 15 6" />
								</svg>
							</button>

							<span className="text-sm md:text-base font-semibold min-w-[90px] md:min-w-[130px] text-center whitespace-nowrap">
								{format(currentDate, "yyyy년 M월", { locale: ko })}
							</span>

							<button
								type="button"
								onClick={() => setCurrentDate(addMonths(currentDate, 1))}
								className="p-1 md:p-2 hover:bg-muted rounded-lg transition-colors"
								aria-label="다음 달"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="w-4 h-4 md:w-5 md:h-5"
								>
									<title>Next</title>
									<polyline points="9 18 15 12 9 6" />
								</svg>
							</button>
						</div>
					</div>

					{/* 캘린더 그리드 */}
					<div className="border border-border rounded-xl overflow-hidden">
						{/* 요일 헤더 */}
						<div className="grid grid-cols-7 bg-muted/30">
							{weekDays.map((day, index) => (
								<div
									key={day}
									className={`py-3 text-center text-sm font-semibold border-r border-border last:border-r-0 ${
										index === 0
											? "text-red-600 dark:text-red-400"
											: index === 6
												? "text-blue-600 dark:text-blue-400"
												: "text-muted-foreground"
									}`}
								>
									{day}
								</div>
							))}
						</div>

						{/* 날짜 그리드 */}
						{weeks.map((week, weekIndex) => (
							<div key={weekIndex} className="grid grid-cols-7 border-t border-border">
								{week.map((day, dayIndex) => {
									const isToday = isSameDay(day, new Date());
									const isCurrentMonth = isSameMonth(day, currentDate);
									const dayOfWeek = getDay(day);
									const isSunday = dayOfWeek === 0;
									const isSaturday = dayOfWeek === 6;
									const events = getEventsForDate(day);

									return (
										<div
											key={day.toString()}
											onClick={() => {
												if (events.length > 0) {
													setSelectedDate(day);
												}
											}}
											className={`aspect-square md:aspect-auto flex flex-col items-center justify-center md:justify-start md:items-stretch md:min-h-[100px] p-1 md:p-2 border-r border-border last:border-r-0 transition-colors ${
												!isCurrentMonth 
													? "bg-gray-100/50 dark:bg-gray-800/30" 
													: isToday 
														? "bg-yellow-100 dark:bg-yellow-950/40" 
														: ""
											} ${events.length > 0 ? "cursor-pointer hover:bg-muted/50" : ""}`}
										>
											{/* 날짜 번호 */}
											<div
												className={`text-sm font-medium mb-1 w-full text-center md:text-left ${
													!isCurrentMonth
														? "text-gray-400 dark:text-gray-600"
														: isSunday
															? "text-red-600 dark:text-red-400"
															: isSaturday
																? "text-blue-600 dark:text-blue-400"
																: "text-foreground"
												} ${isToday ? "font-bold" : ""}`}
											>
												{format(day, "d")}
											</div>

											{/* 데스크톱: 이벤트 바 */}
											<div className="hidden md:block space-y-1.5">
												{events.map((event) => {
													const eventStart = new Date(event.start);
													const eventEnd = new Date(event.end);
													const isMultiDay = !isSameDay(eventStart, eventEnd);
													const isActualStart = isSameDay(eventStart, day);
													const isEnd = isEventEnd(event, day);
													const isWeekStart = dayIndex === 0; // 일요일
													const isWeekEnd = dayIndex === 6; // 토요일

													// 둥근 모서리와 테두리 결정
													let roundedClass = "";
													let borderClass = "";
													
													if (isMultiDay) {
														const startRounded = isActualStart || isWeekStart;
														const endRounded = isEnd || isWeekEnd;

														if (startRounded && endRounded) {
															// 시작하고 끝남 (한 칸)
															roundedClass = "rounded-md";
															borderClass = "border-2";
														} else if (startRounded) {
															// 시작 부분
															roundedClass = "rounded-l-md rounded-r-none";
															borderClass = "border-2 border-r-0";
														} else if (endRounded) {
															// 끝 부분
															roundedClass = "rounded-r-md rounded-l-none";
															borderClass = "border-2 border-l-0";
														} else {
															// 중간 부분
															roundedClass = "rounded-none";
															borderClass = "border-y-2 border-x-0";
														}
													} else {
														roundedClass = "rounded-md";
														borderClass = "border-2";
													}

													// 다른 달의 날짜는 연하게
													const colorClass = !isCurrentMonth
														? "bg-blue-300 dark:bg-blue-700 text-white/80 border-blue-400 dark:border-blue-600 opacity-50"
														: "bg-blue-600 dark:bg-blue-500 text-white border-blue-700 dark:border-blue-600";

													return (
														<button
															key={`desktop-${event.id}-${day.toString()}`}
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																setSelectedDate(day);
															}}
															className={`w-full text-left px-3 py-2 text-xs font-semibold transition-all hover:brightness-110 shadow-sm ${colorClass} ${roundedClass} ${borderClass}`}
															title={`${event.title}\n${format(eventStart, "yyyy-MM-dd")} ~ ${format(eventEnd, "yyyy-MM-dd")}`}
														>
															<div className="flex items-center justify-between gap-1">
																<span className="truncate flex-1">{event.title}</span>
																{isMultiDay && (isActualStart || isEnd) && (
																	<span className="text-[10px] opacity-90 flex-shrink-0 font-normal">
																		{isActualStart
																			? `${format(eventStart, "M/d")} ~`
																			: isEnd
																				? `~ ${format(eventEnd, "M/d")}`
																				: ""}
																	</span>
																)}
															</div>
														</button>
													);
												})}
											</div>

											{/* 모바일: 이벤트 점 */}
											<div className="md:hidden flex flex-wrap gap-1 mt-1 justify-center">
												{events.map((event) => {
													const isMultiDay = !isSameDay(new Date(event.start), new Date(event.end));
													// 다른 달의 날짜는 연하게
													const colorClass = !isCurrentMonth
														? "bg-blue-300 dark:bg-blue-700 opacity-50"
														: "bg-blue-600 dark:bg-blue-500";

													return (
														<button
															key={`mobile-${event.id}-${day.toString()}`}
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																// 모바일에서는 점 클릭 시에도 날짜 선택으로 동작하게 변경 (통일성)
																setSelectedDate(day);
															}}
															className={`w-1.5 h-1.5 rounded-full ${colorClass}`}
															aria-label={event.title}
														/>
													);
												})}
											</div>
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 날짜 선택 다이얼로그 */}
			{selectedDate && (
				<div
					className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
					onClick={() => setSelectedDate(null)}
				>
					<div
						className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-0 mb-0">
								{format(selectedDate, "M월 d일 일정", { locale: ko })}
							</h3>
							<button
								type="button"
								onClick={() => setSelectedDate(null)}
								className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
								aria-label="닫기"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Close</title>
									<line x1="18" y1="6" x2="6" y2="18" />
									<line x1="6" y1="6" x2="18" y2="18" />
								</svg>
							</button>
						</div>

						<div className="space-y-3">
							{getEventsForDate(selectedDate).map((event) => (
								<div
									key={event.id}
									className="w-full text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"
								>
									<div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
										{event.title}
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{event.allDay ? (
											"종일"
										) : (
											<>
												{format(new Date(event.start), "HH:mm")} ~ {format(new Date(event.end), "HH:mm")}
											</>
										)}
									</div>
									{event.description && (
										<div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
											{event.description}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			)}

		</>
	);
}

// D-Day 카운트다운
export function DdayElement(props: DdayType) {
	const [timeLeft, setTimeLeft] = useState<{
		days: number;
		hours: number;
		minutes: number;
		seconds: number;
		isPast: boolean;
	} | null>(null);

	useEffect(() => {
		const calculateTimeLeft = () => {
			const target = new Date(props.targetDate);
			const now = new Date();
			const diff = target.getTime() - now.getTime();
			const isPast = diff < 0;
			const absDiff = Math.abs(diff);

			return {
				days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
				hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((absDiff / (1000 * 60)) % 60),
				seconds: Math.floor((absDiff / 1000) % 60),
				isPast,
			};
		};

		setTimeLeft(calculateTimeLeft());

		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => clearInterval(timer);
	}, [props.targetDate]);

	if (!timeLeft) {
		return null;
	}

	// 그라디언트 색상 선택
	const gradientClass = timeLeft.isPast
		? "bg-gradient-to-br from-gray-400 to-gray-600"
		: timeLeft.days <= 7
			? "bg-gradient-to-br from-rose-400 via-pink-500 to-rose-500"
			: timeLeft.days <= 30
				? "bg-gradient-to-br from-orange-400 via-amber-500 to-orange-500"
				: "bg-gradient-to-br from-blue-400 via-indigo-500 to-blue-500";

	return (
		<div className={`my-8 ${gradientClass} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
			{/* 배경 장식 효과 */}
			<div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

			<div className="relative z-10">
				{/* 헤더: 타이틀과 D-Day 배지 */}
				<div className="flex items-start justify-between mb-4">
					<h3 className="text-2xl font-bold text-white drop-shadow-lg mt-0 mb-0">
						{props.title}
					</h3>
					<div className="bg-white/30 backdrop-blur-md rounded-full px-4 py-1.5 text-white font-bold text-sm shadow-lg">
						{timeLeft.isPast
							? `D+${timeLeft.days}`
							: timeLeft.days === 0
								? "D-DAY"
								: `D-${timeLeft.days}`}
					</div>
				</div>

				{props.description && (
					<p className="text-white/90 mb-6 drop-shadow">
						{props.description}
					</p>
				)}

				{/* 메인 카운터 */}
				<div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-6 shadow-xl">
					<div className="text-center">
						{timeLeft.isPast ? (
							<>
								<div className="text-8xl font-black text-white drop-shadow-2xl mb-2">
									{timeLeft.days}
								</div>
								<div className="text-2xl text-white/90 font-medium">일 지남</div>
							</>
						) : timeLeft.days === 0 ? (
							<>
								<div className="text-8xl font-black text-white drop-shadow-2xl mb-2">
									오늘
								</div>
								<div className="text-2xl text-white/90 font-medium">D-DAY!</div>
							</>
						) : (
							<>
								<div className="text-9xl font-black text-white drop-shadow-2xl mb-2">
									{timeLeft.days}
								</div>
								<div className="text-3xl text-white/90 font-medium">일</div>
							</>
						)}
					</div>
				</div>

				{/* 시간 카운터 (시, 분, 초) */}
				{!timeLeft.isPast && (
					<div className="grid grid-cols-3 gap-4 mb-6">
						<div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center shadow-lg">
							<div className="text-4xl font-bold text-white drop-shadow-lg">
								{timeLeft.hours.toString().padStart(2, "0")}
							</div>
							<div className="text-sm text-white/80 mt-1 font-medium">시</div>
						</div>
						<div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center shadow-lg">
							<div className="text-4xl font-bold text-white drop-shadow-lg">
								{timeLeft.minutes.toString().padStart(2, "0")}
							</div>
							<div className="text-sm text-white/80 mt-1 font-medium">분</div>
						</div>
						<div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center shadow-lg">
							<div className="text-4xl font-bold text-white drop-shadow-lg">
								{timeLeft.seconds.toString().padStart(2, "0")}
							</div>
							<div className="text-sm text-white/80 mt-1 font-medium">초</div>
						</div>
					</div>
				)}

				{/* 날짜 표시 */}
				<div className="flex items-center justify-center gap-2 text-white/90 text-sm">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					<span className="font-medium">
						{new Date(props.targetDate).toLocaleString("ko-KR", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</div>
			</div>
		</div>
	);
}

// 데이터 테이블 (DataTable)
export function DataTableElement(props: DataTableType) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	// 컬럼 정의 생성
	const columns = useMemo<ColumnDef<Record<string, string>>[]>(() => {
		return props.columns.map((col) => {
			// 컬럼 이름 길이 계산
			const nameLength = col.name.length;

			// 해당 컬럼의 모든 데이터 중 가장 긴 값의 길이 계산
			const maxDataLength = props.data.reduce((max, row) => {
				const value = row[`column${col.id}`] || "";
				return Math.max(max, value.length);
			}, 0);

			// 컬럼 이름과 데이터 중 더 긴 것을 기준으로 너비 계산
			// 한글/영문 혼합 고려: 1자당 약 14px, 최소 120px, 최대 400px
			const maxLength = Math.max(nameLength, maxDataLength);
			const calculatedWidth = Math.min(Math.max(maxLength * 14 + 60, 120), 400);

			return {
				accessorKey: `column${col.id}`,
				header: ({ column }) => {
					const isSorted = column.getIsSorted();
					return (
						<div
							className="flex items-center cursor-pointer hover:bg-muted/50 p-2 rounded"
							onClick={() => column.toggleSorting(isSorted === "asc")}
							style={{ minWidth: `${calculatedWidth}px`, maxWidth: `${calculatedWidth}px` }}
						>
							<span className="font-semibold truncate">{col.name}</span>
							{isSorted === "asc" && <span className="ml-1 flex-shrink-0">▲</span>}
							{isSorted === "desc" && <span className="ml-1 flex-shrink-0">▼</span>}
						</div>
					);
				},
				cell: ({ row }) => {
					const value = row.getValue(`column${col.id}`) as string;
					return (
						<div
							style={{
								minWidth: `${calculatedWidth}px`,
								maxWidth: `${calculatedWidth}px`,
							}}
							className="break-words whitespace-normal"
							title={value}
						>
							{value}
						</div>
					);
				},
			};
		});
	}, [props.columns, props.data]);

	const table = useReactTable({
		data: props.data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	});

	// 반응형 페이지네이션 처리
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				table.setPageSize(5);
			} else {
				table.setPageSize(10);
			}
		};

		// 초기 실행
		handleResize();

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [table]);

	// 모바일 정렬 핸들러
	const handleMobileSorting = (columnId: string) => {
		const column = table.getColumn(columnId);
		if (column) {
			const currentSort = column.getIsSorted();
			if (currentSort === "asc") {
				column.toggleSorting(true); // desc
			} else if (currentSort === "desc") {
				column.clearSorting();
			} else {
				column.toggleSorting(false); // asc
			}
		}
	};

	return (
		<div className="my-8">
			{/* 헤더 */}
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-xl font-bold">{props.name}</h3>
			</div>

			{/* 검색 */}
			<div className="mb-4">
				<Input
					placeholder="전체 검색..."
					value={globalFilter ?? ""}
					onChange={(event) => setGlobalFilter(event.target.value)}
					className="max-w-sm"
				/>
			</div>

			{/* 모바일: 정렬 드롭다운 */}
			<div className="mb-4 block md:hidden">
				<Select onValueChange={handleMobileSorting}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="정렬 기준 선택" />
					</SelectTrigger>
					<SelectContent className="bg-gray-100 dark:bg-gray-800">
						{props.columns.map((col) => (
							<SelectItem key={col.id} value={`column${col.id}`}>
								{col.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* 데스크톱: 테이블 뷰 */}
			<div className="hidden md:block rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className="p-0">
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-2">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									결과가 없습니다.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* 모바일: 카드 뷰 */}
			<div className="block md:hidden space-y-4">
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row) => (
						<Card key={row.id} className="overflow-hidden">
							{/* 첫 번째 컬럼을 헤더로 사용 */}
							<div className="bg-gray-200 dark:bg-white/5 p-3 border-b border-border">
								<div className="text-xs text-muted-foreground font-medium mb-0.5">
									{props.columns[0].name}
								</div>
								<div className="font-bold text-base break-words">
									{row.getValue(`column${props.columns[0].id}`) as string || "-"}
								</div>
							</div>
							
							<CardContent className="p-3">
								<div className="grid grid-cols-2 gap-x-4 gap-y-3">
									{props.columns.slice(1).map((col) => {
										const value = row.getValue(`column${col.id}`) as string;
										return (
											<div key={col.id}>
												<div className="text-xs text-muted-foreground font-medium mb-0.5">
													{col.name}
												</div>
												<div className="text-sm font-medium break-words">
													{value || "-"}
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					))
				) : (
					<Card>
						<CardContent className="pt-6 text-center text-muted-foreground">
							결과가 없습니다.
						</CardContent>
					</Card>
				)}
			</div>

			{/* 페이지네이션 */}
			<div className="flex items-center justify-between space-x-2 py-4">
				<div className="text-sm text-muted-foreground">
					{table.getFilteredRowModel().rows.length > 0 ? (
						<>
							{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}번째부터{" "}
							{Math.min(
								(table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
								table.getFilteredRowModel().rows.length
							)}번째까지 표시 (전체 {table.getFilteredRowModel().rows.length}개 항목)
						</>
					) : (
						"표시할 항목이 없습니다"
					)}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						이전
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						다음
					</Button>
				</div>
			</div>
		</div>
	);
}

// 페이지 링크 (Page Link)
export function PageLinkElement(props: PageLinkType) {
	const userId = useUserId();
	const href = `/b/${userId}/${props.pageUrl}`;

	return (
		<Link
			href={href}
			className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
		>
			<span>{props.pageTitle}</span>
			<ExternalLink className="w-3 h-3" />
		</Link>
	);
}

// Callout (안내 상자)
export function CalloutElement(props: CalloutType) {
	// variant를 fumadocs의 type으로 매핑
	const type = props.variant || "info";
	
	return (
		<Callout type={type} title={props.title} className="my-4">
			{props.children.map((child, i) => (
				<React.Fragment key={i}>{renderNode(child)}</React.Fragment>
			))}
		</Callout>
	);
}
