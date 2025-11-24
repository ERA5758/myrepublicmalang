import type { SVGProps } from 'react';

export function MyRepublicLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 40"
      width="200"
      height="40"
      aria-labelledby="logoTitle"
      {...props}
    >
      <title id="logoTitle">MyRepublic Malang</title>
      <style>
        {`.logo-text { font-family: "PT Sans", sans-serif; font-weight: 700; fill: hsl(var(--primary)); }`}
        {`.logo-text-secondary { font-family: "PT Sans", sans-serif; font-weight: 400; fill: hsl(var(--foreground)); }`}
      </style>
      <text x="0" y="28" fontSize="24" className="logo-text">
        MyRepublic
      </text>
      <text x="135" y="28" fontSize="24" className="logo-text-secondary">
        Malang
      </text>
    </svg>
  );
}
