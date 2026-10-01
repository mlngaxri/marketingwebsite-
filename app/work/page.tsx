import type {Metadata} from "next";
import WorkGallery from "../../components/work/WorkGallery";
export const metadata:Metadata = {
  title:"Selected website designs",
  description:"Explore 20 selected designs from the MotionSites portfolio. Find a visual direction for your own Fourthform website.",
  alternates:{canonical:"/work"},
  openGraph:{title:"Forms of possibility | Fourthform",description:"20 selected website designs. Many possibilities for your business.",url:"/work",images:[{url:"/work/monolith-hero.webp",alt:"Monolith, an architectural website design from the MotionSites portfolio"}]},
};
export default function WorkPage(){return <WorkGallery/>;}
