"use client";

import { HardDriveDownload } from "lucide-react";
import { useEffect, useState } from "react";

export const CurrentDownloadButton = () => {
	const [data, setData] = useState<any>(null);
	useEffect(() => {
		const fetchData = async () => {
			const result: any = await fetch(
				"https://api.sopia.dev/contents/latest",
			).then((response) => response.json());
			setData(result.data[0]);
		};
		fetchData();
	}, []);

	const openDownload = () => {
		window.open(
			`https://sopia-v3.s3.ap-northeast-2.amazonaws.com/${data.path}`,
			"_blank",
		);
	};
	return (
		<>
			{data !== null ? (
				<button
					type="button"
					className="w-full min-[400px]:w-auto cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl transform transition-all hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background px-8 py-3 rounded-lg"
					onClick={openDownload}
				>
					<span className="flex items-center">
						<HardDriveDownload className="mr-2" /> {data.version} 버전 다운로드
					</span>
				</button>
			) : (
				"최신 정보를 불러올 수 없습니다."
			)}
		</>
	);
};
