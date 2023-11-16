// pages/_app.js or pages/_app.tsx
import { useEffect } from "react";
import "../styles/global.scss";

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    import("massive-networks-shared-web-components/loader").then(
      (module) => {
        module.defineCustomElements(window);
      }
    );
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
