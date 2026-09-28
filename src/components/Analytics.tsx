import Script from "next/script";
import { siteConfig } from "@/data/site";

/**
 * Loads GA4 and/or GTM only when their IDs are configured via environment
 * variables. Nothing is loaded by default. If you add advertising or serve
 * visitors in jurisdictions that require consent, add a consent banner and
 * switch the Consent Mode defaults below to "denied" until consent is given.
 */
export function Analytics() {
  const { gaId, gtmId, adsenseClient } = siteConfig.analytics;
  return (
    <>
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {gaId && !gtmId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {adsenseClient && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
