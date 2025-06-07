'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 메뉴 아이템 타입 정의
interface MenuItem {
  name: string;
  title: string;
  description: string;
  order: number;
}

export function BundleSidebar() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pathname = usePathname();
  const currentItem = pathname.split('/').pop(); // URL의 마지막 부분 추출
  
  // 메뉴 데이터 불러오기
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/menu/bundle');
        
        if (!response.ok) {
          throw new Error('메뉴를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setMenuItems(data);
        setError(null);
      } catch (err) {
        console.error('메뉴 불러오기 오류:', err);
        setError('메뉴를 불러오는데 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  if (menuItems.length === 0 && !loading && !error) {
    return null; // 메뉴 항목이 없으면 아무것도 표시하지 않음
  }

  return (
    <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-4">
      <h3 className="text-md font-medium mb-2 px-3">번들 문서 목록</h3>
      
      {/* 로딩 상태 표시 */}
      {loading && (
        <div className="py-2 px-3 text-sm text-gray-500">
          불러오는 중...
        </div>
      )}
      
      {/* 에러 상태 표시 */}
      {error && (
        <div className="py-2 px-3 text-sm text-red-500">
          {error}
        </div>
      )}
      
      {/* 메뉴 목록 */}
      <nav>
        <ul className="space-y-1 mt-1">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                href={`/docs/bundle/${item.name}`}
                className={`block py-1.5 px-3 rounded-md text-sm transition-colors ${
                  currentItem === item.name
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={item.description}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}