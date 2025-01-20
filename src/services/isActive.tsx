import {URL_NGROK} from '@env';

const isActive = async (userId: string) => {
  try {
    const response = await fetch(`${URL_NGROK}/api/user/${userId}/isActive`, {
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
