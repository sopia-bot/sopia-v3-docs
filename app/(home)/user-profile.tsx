'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "lucide-react";

export default function UserProfile({
    userId
}: {
    userId: string|number;
}) {
    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        const fetchUser = async () => {
            const result = await fetch("https://kr-api.spooncast.net/users/9781016").then(
                (res) => res.json(),
            );
        
            let user: any = null;
            if (result.status_code === 200) {
                user = result.results[0];
            }
            setUser(user);
        };
        fetchUser();
    }, []);
    

	const followerStr = (cnt: number) => {
		if (cnt >= 1000) {
			return `${(cnt / 1000).toFixed(2)}k`;
		}
		return cnt.toString();
	};
    return (
        <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mb-4 ring-2 ring-[#FF5500] p-1">
                {user ? (
                    <Image
                        src={user.profile_url}
                        alt={user.nickname}
                        width={80}
                        height={80}
                        className="rounded-full"
                        unoptimized
                    />
                ) : (
                    <UserIcon className="w-10 h-10 text-[#FF5500]" />
                )}
            </div>
            <div>
                <Link
                    href={"https://www.spooncast.net/kr/channel/9781016/tab/home"}
                    target="_blank"
                    className="text-xl text-card-foreground hover:underline"
                >
                    <span className="font-bold">파트너 DJ: </span>{user?.nickname || "연하영"}
                </Link>
                {/* <p className="text-md text-muted-foreground">
                    팔로워: {followerStr(user?.follower_count || 0)}
                </p> */}
            </div>
        </div>
    );
}
