import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
  const username = url.searchParams.get('username');
  const email = url.searchParams.get('email');

  // Now you can use the username variable in your component
  return {
    username,
    email
  };
};