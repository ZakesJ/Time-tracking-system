import { ReactNode } from "react";

interface PageHeaderProps {
  title?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, action, children }: PageHeaderProps) {
  return (
    <div className="bg-muted md:sticky md:top-2 md:z-10 flex items-center justify-between px-6 py-4 mb-4 rounded-tr-2xl shrink-0 w-full">
      {children ? (
        children
      ) : (
        <>
          <h1 className="text-[28px] leading-tight font-gabarito font-bold">
            {title}
          </h1>
          {action && <div>{action}</div>}
        </>
      )}
    </div>
  );
}

