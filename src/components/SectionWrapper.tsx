import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  id?: string;
  children: ReactNode;
  className?: string;
}

/* Wraps each section with scroll-driven fade-in / fade-out */
export default function SectionWrapper({ id, children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-30% 0px -30% 0px", once: false });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      animate={{
        opacity: inView ? 1 : 0.15,
        filter: inView ? "blur(0px)" : "blur(4px)",
        scale: inView ? 1 : 0.97,
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </motion.section>
  );
}
