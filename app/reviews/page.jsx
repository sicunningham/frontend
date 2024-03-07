import Link from 'next/link';
import Heading from '@/components/Heading';
import { getReviews } from '@/lib/reviews';
import Image from 'next/image';
import PaginationBar from '@/components/PaginationBar';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Reviews',
};

const PAGE_SIZE = 6;

const parsePageParam = (paramValue) => {
  if (paramValue) {
    const page = parseInt(paramValue);

    if (isFinite(page) && page > 0) {
      return page;
    }
  }
  return 1;
};

export const ReviewsPage = async ({ searchParams }) => {
  const page = parsePageParam(searchParams.page);
  const { reviews, pageCount } = await getReviews(PAGE_SIZE, page);
  return (
    <>
      <Heading>Reviews</Heading>
      <PaginationBar href="/reviews" page={page} pageCount={pageCount} />
      <ul className="flex flex-row flex-wrap gap-3">
        {reviews?.map((review, index) => (
          <li
            key={review?.slug}
            className="bg-white border rounded shadow w-80 hover:shadow-xl"
          >
            <Link href={`/reviews/${review?.slug}`}>
              <Image
                src={review?.image}
                priority={index === 0} //Not lazy loading first image in list
                alt=""
                width="320"
                height="180"
                className="rounded-t"
              />
              <h2 className="font-orbitron font-semibold py-1 text-center">
                {review?.title}
              </h2>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ReviewsPage;
