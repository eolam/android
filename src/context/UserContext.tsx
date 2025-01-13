import React, {createContext, useState} from 'react';

type UserContextType = {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  id: string | null;
};

type UserContextProviderProps = {
  children: React.ReactNode;
};

interface UserContextValue {
  userInfo: UserContextType;
  setUserInfo: (user: UserContextType) => void;
}

export const UserContext = createContext<UserContextValue>({
  userInfo: {
    email: null,
    displayName: null,
    photoURL: null,
    id: null,
  },
  setUserInfo: () => {},
});

export const UserContextProvider = ({children}: UserContextProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserContextType>({
    email: null,
    displayName: null,
    photoURL: null,
    id: null,
  });

  return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
      {children}
    </UserContext.Provider>
  );
};
