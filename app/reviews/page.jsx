'use client';

import Heading from '@/components/Heading';
import { getReviews } from '@/lib/reviews';
import PaginationBar from '@/components/PaginationBar';
import Search from '@/components/Search';
import { ReviewCard } from '@/components/PropertyCard';
import RadioButton from '@/components/RadioButtons';

// export const metadata = {
//   title: 'Reviews',
// };

const PAGE_SIZE = 6;

export const ReviewsPage = async ({ searchParams }) => {
  // Extracting page parameter from searchParams
  const parsePageParam = (paramValue) => {
    if (paramValue) {
      const page = parseInt(paramValue);

      if (isFinite(page) && page > 0) {
        return page;
      }
    }
    return 1;
  };

  const page = parsePageParam(searchParams.page);
  const { reviews, pageCount } = await getReviews(PAGE_SIZE, page);

  return (
    <>
      <Heading>Reviews</Heading>
      <div className="flex justify-between pb-3">
        <Search />
      </div>

      {/* <RadioButton /> */}

      <ul className="flex flex-row flex-wrap gap-3">
        {reviews?.map((review, index) => (
          <ReviewCard review={review} index={index} key={review?.slug} />
        ))}
      </ul>

      <PaginationBar href="/reviews" page={page} pageCount={pageCount} />
    </>
  );
};

export default ReviewsPage;
