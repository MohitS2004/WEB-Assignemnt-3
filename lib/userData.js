import { getToken } from './authenticate';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const addToFavourites = async (id) => {
  const res = await fetch(`${apiUrl}/favourites/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${getToken()}`
    }
  });

  if (res.status === 200) {
    return res.json();
  }
  return [];
};

export const removeFromFavourites = async (id) => {
  const res = await fetch(`${apiUrl}/favourites/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `JWT ${getToken()}`
    }
  });

  if (res.status === 200) {
    return res.json();
  }
  return [];
};

export const getFavourites = async () => {
  const res = await fetch(`${apiUrl}/favourites`, {
    headers: {
      Authorization: `JWT ${getToken()}`
    }
  });

  if (res.status === 200) {
    return res.json();
  }
  return [];
};
