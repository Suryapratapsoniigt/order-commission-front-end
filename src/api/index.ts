import axios from "axios";

console.log(import.meta.env.VITE_APP_BACKEND_URL)
// create axios instance
const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL,
});

// Add a response interceptor
apiInstance.interceptors.response.use(function (response) {
    if(response.status === 200 || response.status === 201){
      
      return response.data
    }
    console.log(response.data, 'data')
    return response;
  }, function (error) {
    
    const errorObject = {
      code : undefined,
      status : 500,
      message : 'Internal server error!'
    }

    if(error?.response?.status >= 400 && error?.response?.status < 500){
      errorObject.status = error.response.status
      errorObject.code = error.response.data.code || ''
      errorObject.message = error.response.data.message
    }

    return Promise.reject(errorObject);
});


export default apiInstance