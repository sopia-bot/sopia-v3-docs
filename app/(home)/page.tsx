import Banner from "@/public/banner.webp";
import {
	ArrowRight,
	Bot,
	HardDriveDownload as DownloadIcon,
	Gift,
	MessageSquare,
	Music,
	Package,
	Quote as QuoteIcon,
	User as UserIcon,
	UsersIcon,
} from "lucide-react"; // UsersIcon 추가
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	variant?: "default" | "outline";
	className?: string;
	size?: "default" | "sm" | "lg";
}

function Button({
	children,
	variant = "default",
	className = "",
	size = "default",
}: ButtonProps) {
	const baseStyle =
		"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer";
	const variantStyles = {
		default: "bg-primary text-primary-foreground hover:bg-primary/90",
		outline:
			"border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
	};
	const sizeStyles = {
		default: "h-9 px-4 py-2",
		sm: "h-8 rounded-md px-3 text-xs",
		lg: "h-10 rounded-md px-8 text-base",
	};

	return (
		<button
			className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
		>
			{children}
		</button>
	);
}

interface FeatureCardProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	className?: string;
}

function FeatureCard({
	title,
	description,
	icon,
	className,
}: FeatureCardProps) {
	return (
		<div
			className={`rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md ${className} min-h-[220px]`}
		>
			<div className="flex items-center gap-4 mb-4">
				<div className="rounded-full bg-primary/10 p-3">{icon}</div>
				<h3 className="text-lg font-bold">{title}</h3>
			</div>
			<p className="text-fd-muted-foreground">{description}</p>
		</div>
	);
}

export default async function HomePage() {
	// Windsurf 스타일을 적용하기 위해 기존 컴포넌트 구조를 일부 수정하고 새로운 섹션을 추가합니다.
	// 이미지 대신 div 스켈레톤 또는 아이콘을 사용합니다.
	const result = await fetch("https://kr-api.spooncast.net/users/2100369").then(
		(res) => res.json(),
	);

	let user: any = null;
	if (result.status_code === 200) {
		user = result.results[0];
	}

	const followerStr = (cnt: number) => {
		if (cnt >= 1000) {
			return `${(cnt / 1000).toFixed(2)}k`;
		}
		return cnt.toString();
	};

	return (
		<main className="flex flex-1 flex-col items-center py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
			{/* Hero Section - Windsurf 스타일 적용 */}
			<section className="w-full py-12 md:py-24 bg-background">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col justify-center space-y-4">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-center">
								<span className="text-blue-600">SOPIA</span> For Your Voice
							</h1>
							<p className="max-w-[600px] mx-auto mt-4 text-muted-foreground md:text-xl text-center">
								당신의 스푼 방송을 더 멋지게 만들어주는 매니저 프로그램.
							</p>
						</div>
						<div className="flex flex-col gap-2 min-[400px]:flex-row mt-[50px] justify-center">
							<Link href="/docs">
								<Button
									size="lg"
									className="gap-2 w-full min-[400px]:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl transform transition-all hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-background px-8 py-3 rounded-lg"
								>
									시작하기
									<ArrowRight className="h-4 w-4" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			<div className="relative">
				<div className="relative rounded-lg top-0 left-0 w-full h-full z-0 banner-border">
					<Image
						src={Banner}
						alt="Banner"
						className="w-full h-auto rounded-lg"
					/>
				</div>
				<div className="pointer-events-none absolute inset-0 dark:bg-black/15">
					<div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#F5F5F5] dark:from-[#121212] to-transparent md:h-44"></div>
				</div>
			</div>

			{/* Why SOPIA? Section - Enhanced Testimonial Design */}
			<section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted via-background to-background">
				<div className="container px-4 md:px-6">
					<div className="mx-auto max-w-3xl text-center">
						<QuoteIcon className="h-12 w-12 mx-auto text-[#FF5500] transform -translate-x-2 -translate-y-2" />
						<blockquote className="relative z-10 text-xl md:text-2xl italic font-medium leading-relaxed text-card-foreground">
							<p className="mb-8">
								소피아는 가이드북처럼 모든 스푼 비기너들에게 추천하고 싶습니다.
								<br />
								방송을 풍성하게 만들 컨텐츠와 다양한 기능이 준비되어 있을 뿐
								아니라 방송을 똑똑하게 서포트해 주기 때문에 방송의 틀을 잡을 때
								큰 도움이 됩니다.
							</p>
						</blockquote>
						<div className="mt-8 flex flex-col items-center text-center">
							<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-4 ring-2 ring-[#FF5500] p-1">
								{user ? (
									<Image
										src={user.profile_url}
										alt={user.nickname}
										width={80}
										height={80}
										className="rounded-full"
									/>
								) : (
									<UserIcon className="w-10 h-10 text-[#FF5500]" />
								)}
							</div>
							<div>
								<Link
									href={"https://www.spooncast.net/kr/channel/2100369/tab/home"}
									target="_blank"
									className="text-xl font-bold text-card-foreground hover:underline"
								>
									{user?.nickname || "연하영"}
								</Link>
								<p className="text-md text-muted-foreground">
									팔로워: {followerStr(user?.follower_count || 0)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section - Windsurf 카드 스타일 적용 */}
			<section className="w-full py-12">
				<div className="container px-4 md:px-6">
					<div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
						<FeatureCard
							title="자동 반응"
							description="입장, 좋아요, 선물 등 다양한 상황에 맞춰 DJ가 설정한 메시지를 자동으로 전송합니다. 반복적인 작업을 줄이고 방송에 집중하세요."
							icon={<Bot className="h-8 w-8 text-blue-600" />}
						/>
						<FeatureCard
							title="룰렛"
							description="후원 연동 룰렛 다양한 조건으로 룰렛을 설정하고, 방송에 재미를 더하세요. 당첨 확률과 상품을 자유롭게 커스터마이징할 수 있습니다."
							icon={<Gift className="h-8 w-8 text-blue-600" />}
						/>
						<FeatureCard
							title="TTS 도네이션"
							description="청취자의 후원 메시지를 실시간으로 음성 변환하여 방송에 송출합니다. 다양한 목소리 톤과 속도를 지원하여 더욱 생동감 있는 소통이 가능합니다."
							icon={<MessageSquare className="h-8 w-8 text-blue-600" />}
						/>
						<FeatureCard
							title="신청곡 관리"
							description="복잡한 신청곡 목록을 깔끔하게 정리하고, 중복 신청 방지, 우선순위 설정 등 편리한 관리 기능을 제공합니다."
							icon={<Music className="h-8 w-8 text-blue-600" />}
						/>
						<FeatureCard
							title="확장 가능한 번들"
							description="기본 기능 외에도 다양한 추가 기능을 번들 스토어에서 손쉽게 설치하고 사용할 수 있습니다. 나만의 맞춤형 방송 환경을 구축하세요."
							icon={<Package className="h-8 w-8 text-blue-600" />}
						/>
					</div>
				</div>
			</section>

			{/* CTA Section - New Design based on Image */}
			<section
				className="w-full py-20 md:py-32"
				style={{
					backgroundImage:
						"radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1.5px)",
					backgroundSize: "20px 20px",
				}}
			>
				<div className="container mx-auto px-4 md:px-6 text-center flex flex-col items-center">
					<div className="mb-6">
						{/* SOPIA Logo Placeholder - Using a stylized S, similar to the W in the image */}
						<svg
							width="60"
							height="60"
							viewBox="0 0 24 24"
							fill="currentColor"
							xmlns="http://www.w3.org/2000/svg"
							className="text-blue-500"
						>
							<path d="M16.213 20.994c-2.23.663-4.798.183-6.708-1.255S6.13 16.586 6.013 14.25c-.117-2.335 1.13-4.556 3.04-5.994s4.478-2.075 6.708-1.412c2.23-.663 3.923.313 4.983 1.97.833 1.308.914 3.065.28 4.688-.634 1.623-2.01 2.982-3.83 3.767-.69.299-1.403.526-2.133.682V19.5a.5.5 0 0 1-1 0v-2.043c.77-.133 1.52-.35 2.233-.657 1.48-.633 2.51-1.663 2.913-2.938.404-1.275.307-2.67-.276-3.85-.584-1.18-1.79-1.94-3.26-2.15-1.47-.21-3.023.33-4.04 1.255-1.017.925-1.56 2.29-1.443 3.625.116 1.335.78 2.556 1.807 3.394.98.803 2.2.95 3.36.95h.12c.117 0 .233-.007.35-.017v-1.98a.5.5 0 0 1 1 0v2.043c-.06.003-.12.006-.18.006-1.53 0-3.223-.576-4.473-1.818-1.25-1.242-1.81-3.018-1.693-4.75.116-1.733 1.016-3.349 2.483-4.444s3.448-1.61 5.358-1.13c1.91.48 3.423 1.717 4.256 3.38.833 1.663.914 3.66-.28 5.283-.69.96-1.66 1.76-2.81 2.27-.57.25-1.16.43-1.75.54Z" />
						</svg>
					</div>
					<p className="mb-4 text-lg text-gray-400">
						[ 이제, 내가 선택할 차례입니다. ]
					</p>
					<h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#FF4100]">
						CHOICE.
					</h2>
					<h2 className="text-2xl md:text-3xl font-bold mb-10 leading-tight">
						당신의 목소리는 완벽하단걸
						<br />더 많은 사람에게 알려주자구요.
					</h2>
					<Link href="/docs/installation" className="inline-block">
						<Button
							size="lg"
							className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl transform transition-all hover:scale-105 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 gap-3 px-8 py-4 rounded-lg text-lg"
						>
							<DownloadIcon className="h-6 w-6" />
							SOPIA 시작하기
						</Button>
					</Link>
				</div>
			</section>
		</main>
	);
}
