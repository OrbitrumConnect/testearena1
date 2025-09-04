import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * BaseLayout centraliza o conteúdo e define padding
 * igual para qualquer viewport. Comece sempre mobile-first.
 */
export default function BaseLayout({ children, className = "" }: Props) {
  return (
    <div className={`max-w-screen-lg mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
