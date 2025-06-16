import type { FormEvent } from 'react';

export function InfoWrapper({
  children,
  title,
  subtitle,
  onSubmit,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="bg-darkish pt-4 px-4 pb-8 rounded-md overflow-x-hidden w-full">
      {subtitle ? (
        <>
          <h2 className="text-2xl font-semibold text-center mb-2">{title}</h2>
          <p className="text-sm text-white/40 text-center mb-4">{subtitle}</p>
        </>
      ) : title ? (
        <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>
      ) : null}
      <form onSubmit={onSubmit} className="flex flex-col items-center space-y-6">
        {children}
      </form>
    </div>
  );
}
