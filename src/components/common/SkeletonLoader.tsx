import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-zinc-100 overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-[3/4] w-full bg-zinc-200" />
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-1/3 bg-zinc-200 rounded-md" />
            <div className="h-3 w-1/5 bg-zinc-200 rounded-md" />
          </div>
          <div className="h-4 w-4/5 bg-zinc-200 rounded-md" />
          <div className="h-3 w-1/2 bg-zinc-200 rounded-md" />
        </div>
        <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
          <div className="h-5 w-1/3 bg-zinc-200 rounded-md" />
          <div className="h-8 w-8 bg-zinc-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] bg-zinc-200 animate-pulse relative p-6 flex flex-col justify-end">
      <div className="space-y-2">
        <div className="h-5 w-2/3 bg-zinc-300 rounded-md" />
        <div className="h-3 w-1/3 bg-zinc-300 rounded-md" />
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-zinc-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-zinc-200 rounded-md w-full" />
        </td>
      ))}
    </tr>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-xs animate-pulse space-y-3">
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/3 bg-zinc-200 rounded-md" />
        <div className="w-10 h-10 bg-zinc-200 rounded-xl" />
      </div>
      <div className="h-8 w-1/2 bg-zinc-200 rounded-md" />
      <div className="h-3 w-2/3 bg-zinc-200 rounded-md" />
    </div>
  );
};
