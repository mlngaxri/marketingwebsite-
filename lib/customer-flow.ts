export const connectedPortal = process.env.NEXT_PUBLIC_CONNECTED_PORTAL === "true";
export function startHref(options:{reference?:string;package?:"first"}={}) {
 const params=new URLSearchParams();if(options.reference)params.set("reference",options.reference);if(options.package)params.set("package",options.package);
 return (connectedPortal?"/start":"/preview/start")+(params.size?`?${params}`:"");
}
