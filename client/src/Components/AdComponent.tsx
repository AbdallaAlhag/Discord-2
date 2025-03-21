// import { useEffect } from "react";

// interface AdComponentProps {
//   adClient: string;
//   adSlot: string;
//   adFormat?: string;
//   fullWidthResponsive?: boolean;
// }


// const AdComponent: React.FC<AdComponentProps> = ({
//   adClient,
//   adSlot,
//   adFormat = "auto",
//   fullWidthResponsive = true,
// }) => {
//   useEffect(() => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const adsbygoogle = (window as any).adsbygoogle ?? [];
//     adsbygoogle.push({});
//   }, []);

//   return (
//     <div>
//       <ins
//         className="adsbygoogle"
//         style={{ display: "block" }}
//         data-ad-client={adClient}
//         data-ad-slot={adSlot}
//         data-ad-format={adFormat}
//         data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
//       ></ins>
//     </div>
//   );
// };

// export default AdComponent;
