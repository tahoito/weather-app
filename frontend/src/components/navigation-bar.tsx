"use client";

import { House } from "lucide-react"
import { Search } from 'lucide-react';
import { Heart } from 'lucide-react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavigationBar() {
    const pathname = usePathname();

    const navItems = [
        { href: '/top', icon: House, label: 'ホーム' },
        { href: '/search', icon: Search, label: '検索' },
        { href: '/favorites', icon: Heart, label: 'お気に入り' },
        { href: '/map', icon: MapPin, label: 'マップ' },
    ];

    return (
        <div className="fixed bottom-0 left-0 w-full h-18 bg-main flex items-center justify-between px-5">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href === '/top' && pathname === '/');
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="w-full text-center"
                    >
                        <Icon
                            size={28}
                            className={`mx-auto ${isActive ? 'text-sub' : ''}`}
                        />
                        <p className="text-[10px] font-medium pt-1">
                            {item.label}
                        </p>
                    </Link>
                );
            })}
        </div>
    );
}

