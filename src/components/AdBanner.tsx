import { useEffect, useRef } from "react";

interface AdBannerProps {
  client?: string;
  slot?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

export default function AdBanner({
  client = "ca-pub-2122929353158422",
  slot,
  format = "auto",
  fullWidthResponsive = true,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && !isLoaded.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      } catch (err) {
        console.error("AdSense push error:", err);
      }
    }
  }, []);

  return (
    <div className={`w-full my-4 flex flex-col items-center justify-center min-h-[90px] bg-slate-900/40 border border-slate-800/80 rounded-xl p-2 text-center overflow-hidden ${className}`}>
      <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">إعلان / Sponsor</span>
      {slot ? (
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
        />
      ) : (
        <div className="text-xs text-slate-400 py-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>مساحة إعلانية مجهزة (AdSense / AdMob Ready)</span>
        </div>
      )}
    </div>
  );
}
