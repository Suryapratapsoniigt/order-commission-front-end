import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import enTranslations from '@shopify/polaris/locales/en.json';
import {  AppProvider } from '@shopify/polaris';
import router from './routes/router';


// CREATE A QUERY CLIENT
const queryClient = new QueryClient()

function App() {

  return (
    <>
    {/* wrap whole app inside Shopify App Provider  */}
     <AppProvider i18n={enTranslations}>
      {/* wrap whole app in query client provider  */}
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
     </AppProvider>
    </>
  )
}

export default App
