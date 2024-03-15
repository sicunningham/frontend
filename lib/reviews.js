// import 'server-only';

import { marked } from 'marked';
import qs from 'qs';

export const CACHE_TAG_REVIEWS = 'reviews';

const CMS_URL = process.env.CMS_URL;

export const getReviews = async (pageSize, page) => {
  try {
    const { data, meta } = await fetchReviews({
      fields: ['slug', 'title', 'subtitle', 'publishedAt'],
      populate: { image: { fields: ['url'] } },
      sort: ['publishedAt:desc'],
      pagination: { pageSize, page },
    });

    return {
      pageCount: meta?.pagination?.pageCount,
      reviews: data?.map(toReview),
    };
  } catch (error) {
    console.error('Error getting reviews:', error);
  }
};

export const getSearchResults = async (query) => {
  const { data } = await fetchReviews({
    filters: { title: { $containsi: query } },
    populate: { image: { fields: ['url'] } },
    fields: ['slug', 'title'],
    sort: ['title'],
    pagination: { pageSize: 5 },
  });
  return data.map(({ attributes }) => ({
    slug: attributes?.slug,
    title: attributes?.title,
    image: CMS_URL + attributes?.image.data.attributes.url,
  }));
};

export const getReview = async (slug) => {
  const { data } = await fetchReviews({
    filters: { slug: { $eq: slug } },
    fields: ['slug', 'title', 'subtitle', 'publishedAt', 'body'],
    populate: { image: { fields: ['url'] } },
    pagination: { pageSize: 1, withCount: false },
  });

  if (data.length === 0) {
    return null;
  }

  const item = data[0];
  return {
    ...toReview(item),
    body: marked(item.attributes.body, { headerIds: false, mangle: false }),
  };
};

export const getSlugs = async () => {
  const { data } = await fetchReviews({
    fields: ['slug'],
    sort: ['publishedAt:desc'],
    pagination: { pageSize: 100 },
  });
  return data.map((item) => item.attributes.slug);
};

const fetchReviews = async (parameters) => {
  try {
    const url =
      `${CMS_URL}/api/reviews?` +
      qs.stringify(parameters, { encodeValuesOnly: true });

    const response = await fetch(url, {
      next: {
        tags: [CACHE_TAG_REVIEWS],
      },
    });

    if (!response.ok) {
      throw new Error(`CMS returned ${response.status} for ${url}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

const toReview = (item) => {
  const { attributes } = item;
  return {
    slug: attributes?.slug,
    title: attributes?.title,
    subtitle: attributes?.subtitle,
    date: attributes?.publishedAt.slice(0, 'yyyy-mm-dd'.length),
    image: CMS_URL + attributes?.image.data.attributes.url,
  };
};
