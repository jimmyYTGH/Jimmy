import { useEffect, useRef } from "react";

const mouse = { x: 0, y: 0 };
const dotPos = { x: 0, y: 0 };
const ballPos = { x: 0, y: 0 };
let ballScale = 1;
let isHovered = false;
let targetScale = 1;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ball = ballRef.current;
    if (!dot || !ball) return;

    // Start near viewport center
    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2;
    dotPos.x = mouse.x;
    dotPos.y = mouse.y;
    ballPos.x = mouse.x;
    ballPos.y = mouse.y;

    const animate = () => {
      // White dot — fast stiff spring
      dotPos.x += (mouse.x - dotPos.x) * 0.45;
      dotPos.y += (mouse.y - dotPos.y) * 0.45;

      // Gradient ball — smooth trailing spring
      ballPos.x += (mouse.x - ballPos.x) * 0.12;
      ballPos.y += (mouse.y - ballPos.y) * 0.12;

      // Scale spring
      targetScale = isHovered ? 2.4 : 1;
      ballScale += (targetScale - ballScale) * 0.1;

      const ballSize = 12 * ballScale;
      dot.style.transform = `translate3d(${dotPos.x - 3}px, ${dotPos.y - 3}px, 0)`;
      ball.style.transform = `translate3d(${ballPos.x - ballSize}px, ${ballPos.y - ballSize}px, 0) scale(${ballScale})`;

      requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest(
        'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])'
      );
      if (el) {
        isHovered = true;
        ball.style.background =
          "radial-gradient(circle, rgba(0,240,255,0.5) 0%, rgba(168,85,247,0.35) 50%, transparent 100%)";
        ball.style.boxShadow = "0 0 35px rgba(0,240,255,0.5)";
      }
    };

    const defaultBg =
      "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(0,240,255,0.2) 60%, transparent 100%)";

    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest(
        'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])'
      );
      if (el) {
        isHovered = false;
        ball.style.background = defaultBg;
        ball.style.boxShadow = "none";
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });
    const raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] size-[6px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      />
      <div
        ref={ballRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] size-6 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(0,240,255,0.2) 60%, transparent 100%)",
          filter: "blur(0.5px)",
          transition: "background 200ms, box-shadow 200ms",
        }}
      />
    </>
  );
}
