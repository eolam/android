const isActive = async (userId: string) => {
  try {
    const response = await fetch(
      `https://eolam.vercel.app/api/user/${userId}/isActive`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error);
  }
};

export default isActive;
