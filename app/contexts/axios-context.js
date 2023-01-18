import axios from 'axios';
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { constants } from '../configs/constants';
import { userState } from '../store/slices/userSlice';

const AxiosContext = createContext({
  axiosInstance: null,
});

export function useAxiosObject() {
  return useContext(AxiosContext).axiosInstance;
}

function AxiosProvider({ children }) {
  const axiosRef = useRef(
    axios.create({
      baseURL: constants.baseURL,
    })
  );
  const userSelector = useSelector(userState);

  const asyncFunction = async () => {
    console.log('hereherere');
    if (userSelector.tokens) {
      console.log(userSelector.tokens);
      const axiosObj = axios.create({
        baseURL: constants.baseURL,
        headers: {
          token: userSelector.tokens.access_token,
        },
      });
      axiosRef.current = axiosObj;
    }
  };

  useEffect(() => {
    asyncFunction();
  }, [asyncFunction]);

  return (
    <AxiosContext.Provider value={{ axiosInstance: axiosRef.current }}>
      {children}
    </AxiosContext.Provider>
  );
}

export default AxiosProvider;
