import {URL_BASE} from '@env';

const isActive = async (userId: string) => {
	let url_base: string = URL_BASE;
  try {
    const response = await fetch(`${url_base}/api/user/${userId}/isActive`, {
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
