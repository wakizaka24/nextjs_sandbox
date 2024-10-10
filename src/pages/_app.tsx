import type { AppProps } from "next/app";
import "./globals.css";
import { MarkGameProvider } from "@/providers/MarkGameProvider";
import { FirebaseProvider } from "@/providers/FirebaseProvider";

export default function App({ Component, pageProps }: AppProps) {
  return <FirebaseProvider><MarkGameProvider>
      <Component {...pageProps} />
  </MarkGameProvider></FirebaseProvider>;
}
