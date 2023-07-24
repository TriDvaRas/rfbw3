import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Rubik } from "next/font/google";
import { Theme } from "react-daisyui";
import { QueryClient, QueryClientProvider } from "react-query";
import "~/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { api } from "~/utils/api";
import { ToastContainer } from "react-toastify";
import GlobalModals from "../components/GlobalModals";
const rubic = Rubik({
  style: ['normal', 'italic'],
  subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'hebrew', 'latin-ext'],
  display: 'swap',
});
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const queryClient = new QueryClient()
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${rubic.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Theme dataTheme="rfbw" className="bg-gradient-to-b from-slate-800 to-black">
            <Component {...pageProps} />
            
            <GlobalModals />

            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark" />
          </Theme>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
