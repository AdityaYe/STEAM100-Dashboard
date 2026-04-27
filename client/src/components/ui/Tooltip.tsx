import type { ReactNode } from "react";

interface Props {
  text: string;
  children: ReactNode;
}

const tooltipClass = `
absolute
bottom-full
left-1/2
mb-2
-z-0
-translate-x-1/2
hidden
whitespace-nowrap
rounded
border
border-gray-700
bg-gray-800
px-2
py-1
text-xs
text-white
group-hover:block
z-50
`;

const Tooltip = ({
  text,
  children,
}: Props) => {
  return (
    <div className="relative group inline-block">
      {children}

      <div className={tooltipClass}>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;