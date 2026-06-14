import bhima from "@/assets/videos/bhima-raas-leela.mp4.asset.json";
import catAi from "@/assets/videos/cat-ai.mp4.asset.json";
import ccpl from "@/assets/videos/ccpl-3d.mp4.asset.json";
import campa2d from "@/assets/videos/campa-2d.mp4.asset.json";
import campa3d from "@/assets/videos/campa-3d.mp4.asset.json";
import caterpillar from "@/assets/videos/caterpillar-3d.mp4.asset.json";
import factoryVR from "@/assets/videos/factory-vr.mp4.asset.json";
import gurunanda from "@/assets/videos/gurunanda-cgi.mp4.asset.json";
import kfsh from "@/assets/videos/kfsh-explainer.mp4.asset.json";
import kingfisher from "@/assets/videos/kingfisher-3d.mp4.asset.json";
import metaverse from "@/assets/videos/metaverse-city.mp4.asset.json";
import motilal from "@/assets/videos/motilal-anamorphic.mp4.asset.json";
import muzen from "@/assets/videos/muzen-speaker-3d.mp4.asset.json";
import phoenix from "@/assets/videos/phoenix-mall-cgi.mp4.asset.json";
import shopontime from "@/assets/videos/shopontime-anamorphic.mp4.asset.json";
import siemens from "@/assets/videos/siemens-gamesa-3d.mp4.asset.json";
import sirc from "@/assets/videos/sirc-hologram.mp4.asset.json";

export type VideoItem = {
  url: string;
  client: string;
  title: string;
  service: string;
  industry: string;
};

export const videos: VideoItem[] = [
  { url: bhima.url, client: "Bhima Jewellery", title: "Raas Leela", service: "Brand Storytelling", industry: "Retail" },
  { url: campa3d.url, client: "Campa", title: "Campa 3D", service: "3D Animation", industry: "Beverages" },
  { url: campa2d.url, client: "Campa", title: "Campa 2D", service: "Motion Graphics", industry: "Beverages" },
  { url: caterpillar.url, client: "Caterpillar", title: "Caterpillar 3D", service: "3D Animation", industry: "Industrial" },
  { url: catAi.url, client: "Caterpillar", title: "CAT AI", service: "AI", industry: "Industrial" },
  { url: ccpl.url, client: "CCPL", title: "CCPL 3D", service: "3D Animation", industry: "Industrial" },
  { url: factoryVR.url, client: "Factory", title: "Factory VR", service: "Immersive XR Training", industry: "Manufacturing" },
  { url: gurunanda.url, client: "GuruNanda", title: "Dual Mouthwash CGI", service: "Product 3D", industry: "FMCG" },
  { url: kfsh.url, client: "KFSH", title: "KFSH Explainer", service: "Explainer", industry: "Healthcare" },
  { url: kingfisher.url, client: "Kingfisher", title: "Kingfisher 3D", service: "3D Animation", industry: "Beverages" },
  { url: metaverse.url, client: "Metaverse", title: "Metaverse City", service: "PropViz Experiences", industry: "Real Estate" },
  { url: motilal.url, client: "Motilal Oswal", title: "Motilal Anamorphic", service: "Anamorphic & DOOH", industry: "Finance" },
  { url: muzen.url, client: "Muzen", title: "Muzen Speaker", service: "Product 3D", industry: "Consumer" },
  { url: phoenix.url, client: "Phoenix Mall", title: "Phoenix CGI", service: "Anamorphic & DOOH", industry: "Retail" },
  { url: shopontime.url, client: "ShopOnTime", title: "ShopOnTime Anamorphic", service: "Anamorphic & DOOH", industry: "Retail" },
  { url: siemens.url, client: "Siemens Gamesa", title: "Siemens Gamesa 3D", service: "3D Animation", industry: "Energy" },
  { url: sirc.url, client: "Sirc", title: "Sirc Hologram", service: "Event & Immersive Hardware", industry: "Events" },
];
