'use client';
import Image from 'next/image';

interface Props { size?: 'sm' | 'md' | 'lg' }

const SIZES = { sm: { w: 80, h: 36 }, md: { w: 110, h: 50 }, lg: { w: 150, h: 68 } };

export default function SpaceBlueLogo({ size = 'md' }: Props) {
  const { w, h } = SIZES[size];
  return (
    <Image
      src="/logo.png"
      alt="SpaceBlue"
      width={w}
      height={h}
      style={{ objectFit: 'contain' }}
      priority
    />
  );
}
