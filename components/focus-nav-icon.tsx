import type { SVGProps } from "react";

// Four curved blades traced from the Focus mark, styled like the menu icons.
export function FocusNavIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {[0, 90, 180, 270].map((rotation) => (
        <path
          key={rotation}
          transform={`rotate(${rotation} 12 12)`}
          d="M7.2 10C6.4 5.6 10.8 1 15.2 1C19.8 1 23 5.4 23 10.8C19.7 5.7 12.1 3.6 7.2 10Z"
        />
      ))}
    </svg>
  );
}
