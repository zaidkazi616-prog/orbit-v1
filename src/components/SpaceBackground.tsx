import { useMemo } from "react";

function useStars(count: number, seed: number) {
  return useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: count }, () => ({
      top: rand() * 100,
      left: rand() * 100,
      size: 0.6 + rand() * 1.8,
      delay: rand() * 6,
      duration: 2.5 + rand() * 5,
    }));
  }, [count, seed]);
}

export function SpaceBackground() {
  const stars = useStars(120, 7);
  const satellites = [
    { top: 18, delay: 0, duration: 46, size: 14 },
    { top: 62, delay: 16, duration: 62, size: 10 },
    { top: 84, delay: 32, duration: 54, size: 8 },
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute -top-40 -left-32 h-[46rem] w-[46rem] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, var(--nebula-1), transparent 65%)",
          animation: "orbit-breathe 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[40rem] w-[40rem] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(circle, var(--nebula-2), transparent 65%)",
          animation: "orbit-breathe 24s ease-in-out infinite 3s",
        }}
      />
      <div
        className="absolute -bottom-56 left-1/4 h-[38rem] w-[38rem] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(circle, var(--nebula-3), transparent 65%)",
          animation: "orbit-breathe 30s ease-in-out infinite 6s",
        }}
      />
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: star.size,
            height: star.size,
            animation: `orbit-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      {satellites.map((sat, i) => (
        <span
          key={i}
          className="absolute opacity-40"
          style={{
            top: `${sat.top}%`,
            animation: `orbit-drift ${sat.duration}s linear ${sat.delay}s infinite`,
          }}
        >
          <span
            className="block rounded-[3px] border border-primary/60 bg-primary/20"
            style={{ width: sat.size, height: sat.size * 0.5 }}
          />
        </span>
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_100%)]" />
    </div>
  );
}
