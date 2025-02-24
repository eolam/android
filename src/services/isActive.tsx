import {URL_BASE} from '@env';

const isActive = async (userId: string) => {
  try {
    const response = await fetch(`${URL_BASE}/api/user/${userId}/isActive`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export default isActive;
