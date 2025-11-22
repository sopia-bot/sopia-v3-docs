"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, FileText, Home } from "lucide-react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface PageListItem {
	id: number;
	user_id: number;
	url: string;
	title: string;
	updated_at: string;
}

interface ApiResponse<T> {
	status: number;
	error?: boolean;
	msg?: string;
	data: T[];
}

interface PageSidebarProps {
	userId: string;
}

export function PageSidebar({ userId }: PageSidebarProps) {
	const [pages, setPages] = useState<PageListItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		async function fetchPages() {
			try {
				const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
				const response = await fetch(`${apiUrl}/dj-board/pages/list/${userId}`, {
					cache: "no-store",
				});

				if (!response.ok) {
					console.error("Failed to fetch page list:", response.status);
					setPages([]);
					return;
				}

				const data: ApiResponse<PageListItem> = await response.json();
				setPages(data.data || []);
			} catch (error) {
				console.error("Error fetching page list:", error);
				setPages([]);
			} finally {
				setIsLoading(false);
			}
		}

		if (userId) {
			fetchPages();
		}
	}, [userId]);

	const mainPage = pages.find((p) => p.url === "");
	const otherPages = pages.filter((p) => p.url !== "");

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
					<Menu className="h-5 w-5" />
					<span className="sr-only">메뉴 열기</span>
				</Button>
			</DrawerTrigger>
			<DrawerContent className="h-[85vh]">
				<DrawerHeader>
					<DrawerTitle>페이지 목록</DrawerTitle>
				</DrawerHeader>
				<div className="overflow-y-auto px-4 pb-8">
					{isLoading ? (
						<div className="text-center py-8 text-muted-foreground">
							로딩 중...
						</div>
					) : pages.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							페이지가 없습니다.
						</div>
					) : (
						<div className="space-y-2">
							{/* 메인 페이지 */}
							{mainPage && (
								<>
									<Link
										href={`/b/${userId}`}
										onClick={() => setOpen(false)}
										className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
									>
										<Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
										<div>
											<div className="font-medium">{mainPage.title || "메인 페이지"}</div>
											<div className="text-xs text-muted-foreground">
												{new Date(mainPage.updated_at).toLocaleDateString("ko-KR")}
											</div>
										</div>
									</Link>
									{otherPages.length > 0 && (
										<div className="px-4 py-2 text-xs font-semibold text-muted-foreground">
											모든 페이지
										</div>
									)}
								</>
							)}

							{/* 나머지 페이지들 */}
							{otherPages.map((page) => (
								<Link
									key={page.id}
									href={`/b/${userId}/${page.url}`}
									onClick={() => setOpen(false)}
									className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
								>
									<FileText className="h-5 w-5 text-muted-foreground" />
									<div>
										<div className="font-medium">{page.title}</div>
										<div className="text-xs text-muted-foreground">
											{new Date(page.updated_at).toLocaleDateString("ko-KR")}
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
