import { createContext, useState, useContext } from 'react';
import Loader from '../components/Loader';
import { useEffect } from 'react';
import { loaderHandler } from '../api/axios';

const LoadingContext = createContext();

const useLoading = ()=>{
    return useContext(LoadingContext)
}

export const LoadingProvider = ({children}) => {
    
    const [isLoading,setIsLoading] = useState(false);
    
    const showLoader = ()=> setIsLoading(true);
    const hideLoader = ()=> setIsLoading(false);
    
    useEffect(()=>{
        loaderHandler(showLoader,hideLoader);
    },[])
    
    return (
        <LoadingContext.Provider value={{isLoading,showLoader,hideLoader}}>
        {children}
        {isLoading && <Loader/>}
    </LoadingContext.Provider>
  )
}
