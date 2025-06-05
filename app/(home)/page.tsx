import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Gift, Music, MessageSquare, Bot, Package } from 'lucide-react';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'default' | 'outline';
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

function Button({ children, variant = 'default', className = '', size = 'default' }: ButtonProps) {
  const baseStyle = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
  };
  const sizeStyles = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8 text-base'
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

function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="rounded-full bg-primary/10 p-3">
          {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <p className="text-fd-muted-foreground">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="w-full max-w-3xl text-center mb-16">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">SOPIA</span>
        </h1>
        <p className="text-2xl mb-8 text-fd-muted-foreground">
          스푼라디오 DJ를 위한 올인원 매니저 프로그램
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/docs">
            <Button className="gap-2">
              시작하기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/docs/installation">
            <Button variant="outline" className="gap-2">
              설치 방법
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            title="봇 자동 반응" 
            description="입장, 좋아요, 선물, 채팅에 대한 자동 반응을 설정할 수 있습니다." 
            icon={<Bot className="h-6 w-6 text-primary" />}
          />
          <FeatureCard 
            title="룰렛" 
            description="선물을 받았을 때 DJ가 설정한 룰렛을 돌려 보상을 얻을 수 있습니다." 
            icon={<Gift className="h-6 w-6 text-primary" />}
          />
          <FeatureCard 
            title="도네이션" 
            description="주목받고 싶은 채팅이 있을 때, TTS엔진이 채팅을 읽어줍니다." 
            icon={<MessageSquare className="h-6 w-6 text-primary" />}
          />
          <FeatureCard 
            title="신청곡 관리" 
            description="청취자들의 신청곡을 알아서 잘 관리할 수 있습니다." 
            icon={<Music className="h-6 w-6 text-primary" />}
          />
          <FeatureCard 
            title="번들 기능" 
            description="필요한 기능이 있으면 번들스토어에서 얼마든지 기능을 추가할 수 있습니다." 
            icon={<Package className="h-6 w-6 text-primary" />}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-3xl bg-card border border-border rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">지금 바로 SOPIA로 방송을 시작하세요</h2>
        <p className="text-fd-muted-foreground mb-6">
          스푼라디오 매니저 프로그램으로 방송을 더 효율적으로 운영하세요.
          초보 DJ부터 전문 DJ까지 모두를 위한 최고의 도구입니다.
        </p>
        <Link href="/docs">
          <Button size="lg">
            문서 살펴보기
          </Button>
        </Link>
      </div>
    </main>
  );
}
