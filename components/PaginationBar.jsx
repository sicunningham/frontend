import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

export const PaginationBar = ({ href, page, pageCount }) => {
  const PaginationLink = ({ children, enabled, href }) => {
    if (!enabled) {
      return (
        <span className="border cursor-not-allowed rounded text-slate-300 text-sm">
          {children}
        </span>
      );
    }

    return (
      <Link
        href={href}
        className="border rounded text-slate-500 text-sm
      hover:bg-orange-100 hover:text-slate-700"
      >
        {children}
      </Link>
    );
  };
  return (
    <div className="flex items-center gap-2 pb-3">
      <PaginationLink enabled={page > 1} href={`${href}?page=${page - 1}`}>
        <ChevronLeftIcon className="h-5 w-5" />
        <span className="sr-only">Previous page</span>
      </PaginationLink>
      <span>
        Page {page} of {pageCount}
      </span>
      <PaginationLink
        enabled={page < pageCount}
        href={`${href}?page=${page + 1}`}
      >
        <ChevronRightIcon className="h-5 w-5" />
        <span className="sr-only">Next page</span>
      </PaginationLink>
    </div>
  );
};

export default PaginationBar;
