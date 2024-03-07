import { CACHE_TAG_REVIEWS } from '@/lib/reviews';
import { revalidateTag } from 'next/cache';

export const POST = async (request) => {
  const payload = await request.json();
  if (payload.model === 'review') {
    revalidateTag(CACHE_TAG_REVIEWS);
    console.log('revalidate:', CACHE_TAG_REVIEWS);
  }
  return new Response(null, { status: 204 });
};
