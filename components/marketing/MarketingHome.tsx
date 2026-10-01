"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { demoSite } from "../../lib/preview/site";

const stripScript = (html: string) => html.replace(/<script>[\s\S]*<\/script>/, "");

export default function MarketingHome(){
  const heroSite=useMemo(()=>stripScript(demoSite("/",false)),[]);
  const monday=useMemo(()=>stripScript(demoSite("/",false,"A table worth\nstaying for.")),[]);
  const saturday=useMemo(()=>stripScript(demoSite("/",true,"A longer lunch.\nA little more time.")),[]);
  const [menuOpen,setMenuOpen]=useState(false);
  const menuButton=useRef<HTMLButtonElement|null>(null);
  const mobileMenu=useRef<HTMLDivElement|null>(null);
  const root=useRef<HTMLElement|null>(null);

  useEffect(()=>{if(!menuOpen)return;mobileMenu.current?.querySelector<HTMLAnchorElement>("a")?.focus();const close=(event:KeyboardEvent)=>{if(event.key==="Escape"){setMenuOpen(false);menuButton.current?.focus();}};const outside=(event:PointerEvent)=>{if(!mobileMenu.current?.contains(event.target as Node)&&!menuButton.current?.contains(event.target as Node))setMenuOpen(false);};const query=matchMedia("(min-width:761px)");const resize=()=>{if(query.matches)setMenuOpen(false);};document.addEventListener("keydown",close);document.addEventListener("pointerdown",outside);query.addEventListener("change",resize);return()=>{document.removeEventListener("keydown",close);document.removeEventListener("pointerdown",outside);query.removeEventListener("change",resize);};},[menuOpen]);
  useEffect(()=>{
    let cancelled=false,generation=0;
    const motion=matchMedia("(prefers-reduced-motion: reduce)");
    async function boot(run:number){
      if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
      const [{default:gsap},{ScrollTrigger},{default:Lenis}]=await Promise.all([
        import("gsap"), import("gsap/ScrollTrigger"), import("lenis")
      ]);
      if(cancelled || run!==generation || motion.matches)return;
      root.current?.classList.add("mk-motion");
      gsap.registerPlugin(ScrollTrigger);
      const lenis=new Lenis({lerp:.09,smoothWheel:true,wheelMultiplier:.88,anchors:true,autoRaf:false});
      lenis.on("scroll",ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t*1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const ctx=gsap.context(()=>{
        const intro=gsap.timeline({defaults:{ease:"power4.out"}});
        intro.from(".mk-hero-line>span",{yPercent:112,duration:1.05,stagger:.07})
          .from(".mk-hero-copy .mk-body",{opacity:0,y:18,duration:.72},.24)
          .from(".mk-hero-actions",{opacity:0,y:14,duration:.62},.34)
          .from(".mk-hero-site",{opacity:0,y:52,scale:.955,duration:1.1,ease:"expo.out"},.12);

        gsap.timeline({scrollTrigger:{trigger:".mk-hero-wrap",start:"top top",end:"bottom bottom",scrub:1.1}})
          .to(".mk-hero-copy",{opacity:.12,y:-24,ease:"none"},0)
          .to(".mk-hero-site",{width:"min(1040px,92vw)",height:"min(680px,69vh)",borderRadius:10,y:28,ease:"none"},0);

        gsap.from(".mk-manifesto h2",{y:42,opacity:0,duration:1,ease:"power4.out",scrollTrigger:{trigger:".mk-manifesto",start:"top 72%"}});
        gsap.from(".mk-manifesto p",{y:22,opacity:0,duration:.8,ease:"power3.out",scrollTrigger:{trigger:".mk-manifesto",start:"top 64%"}});

        gsap.to(".mk-process-progress",{scaleX:1,ease:"none",scrollTrigger:{trigger:".mk-process",start:"top 62%",end:"bottom 58%",scrub:1}});
        gsap.from(".mk-process-step",{y:24,opacity:0,stagger:.08,duration:.72,ease:"power3.out",scrollTrigger:{trigger:".mk-process-rail",start:"top 80%"}});

        gsap.fromTo(".mk-preview-shell",{scale:.945,y:62,opacity:.45},{scale:1,y:0,opacity:1,ease:"none",scrollTrigger:{trigger:".mk-portal",start:"top 72%",end:"top 22%",scrub:1.05}});

        const states=gsap.timeline({scrollTrigger:{trigger:".mk-states",start:"top top",end:"+=105%",scrub:1,pin:".mk-states-pin",anticipatePin:1}});
        states.to(".mk-state-monday",{opacity:0,scale:.985,ease:"none"},.12)
          .fromTo(".mk-state-saturday",{opacity:0,scale:1.015},{opacity:1,scale:1,ease:"none"},.18)
          .to(".mk-state-label span:first-child",{opacity:.28},.18)
          .to(".mk-state-label span:last-child",{opacity:1},.18);

        gsap.from(".mk-price-line",{clipPath:"inset(0 100% 0 0)",duration:1.05,ease:"power4.inOut",scrollTrigger:{trigger:".mk-pricing",start:"top 72%"}});
        gsap.from(".mk-final-grid>*",{y:32,opacity:0,stagger:.08,duration:.9,ease:"power4.out",scrollTrigger:{trigger:".mk-final",start:"top 70%"}});
      },root);
      const refresh=()=>{if(!cancelled&&run===generation)ScrollTrigger.refresh(true);};
      addEventListener("load",refresh,{once:true});
      void document.fonts.ready.then(refresh);
      refresh();
      return ()=>{removeEventListener("load",refresh);ctx.revert();lenis.destroy();gsap.ticker.remove(tick);root.current?.classList.remove("mk-motion");};
    }
    let cleanup:(()=>void)|undefined;
    const start=()=>{const run=++generation;void boot(run).then(c=>{if(cancelled||run!==generation)c?.();else cleanup=c;}).catch(()=>{if(run===generation)root.current?.classList.remove('mk-motion');});};
    const preferenceChanged=()=>{generation++;cleanup?.();cleanup=undefined;if(!motion.matches)start();};
    motion.addEventListener('change',preferenceChanged);start();
    return()=>{cancelled=true;generation++;motion.removeEventListener('change',preferenceChanged);cleanup?.();};
  },[]);

  return <main ref={root} className="mk-site" id="top">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <nav className="mk-nav" aria-label="Primary navigation"><a className="mk-wordmark" href="#top">fourthform</a><div className="mk-nav-links"><a href="#work">Work</a><a href="#process">Process</a><a href="#portal">Portal</a><a href="#states">States</a><a href="https://fourthform-client-portal.vercel.app/">Client portal ↗</a><a href="#pricing">Pricing</a></div><button ref={menuButton} className="mk-menu-toggle" type="button" aria-controls="mk-mobile-menu" aria-expanded={menuOpen} aria-label={menuOpen?"Close navigation":"Open navigation"} onClick={()=>setMenuOpen(open=>!open)}>{menuOpen?"Close":"Menu"}</button><a className="mk-button mk-button-dark" href="/preview/start">Start a site</a><div ref={mobileMenu} className="mk-mobile-menu" id="mk-mobile-menu" hidden={!menuOpen}>{[["#work","Work"],["#process","Process"],["#portal","Portal preview"],["#states","States"],["#pricing","Pricing"],["#questions","Questions"],["https://fourthform-client-portal.vercel.app/","Client portal ↗"]].map(([href,label])=><a key={href} href={href} onClick={()=>{setMenuOpen(false);menuButton.current?.focus();}}>{label}</a>)}</div></nav>

    <section className="mk-hero-wrap" id="main-content" tabIndex={-1}><div className="mk-hero"><div className="mk-container mk-hero-grid"><div className="mk-hero-copy"><h1 className="mk-display"><span className="mk-hero-line"><span>Websites,</span></span><span className="mk-hero-line"><span><em>brought into form.</em></span></span></h1><p className="mk-body">From the first direction to the live site, Fourthform gives you one place to shape, review, launch and keep your website current.</p><p className="mk-included">3 revision rounds included</p><div className="mk-hero-actions"><a className="mk-button mk-button-dark" href="/preview/start">Start a site</a><a className="mk-text-link" href="#portal">Explore the portal ↘</a></div></div><div className="mk-hero-stage"><div className="mk-hero-site"><iframe tabIndex={-1} title="Mori House website example" sandbox="allow-same-origin" srcDoc={heroSite}/></div><span className="mk-stage-caption">One website, taking form.</span></div></div></div></section>

    <section className="mk-manifesto"><div className="mk-container mk-manifesto-grid"><span className="mk-kicker">The idea</span><div><h2 className="mk-display">From brief to live,<br/><em>in one place.</em></h2><p className="mk-body">The website stays at the centre. Direction, review, revisions and launch happen around it, without disappearing into email threads and scattered folders.</p></div></div></section>

    <section className="mk-selected-work" id="work"><div className="mk-container"><div className="mk-section-head"><span className="mk-kicker">A direction, taking form</span><h2 className="mk-display">Considered details.<br/><em>A clearer whole.</em></h2></div><figure className="mk-selected-photo"><img src="/marketing/mori-dish.webp" alt="Seasonal Japanese dish from the Mori House restaurant concept" width="1400" height="900" loading="lazy"/><figcaption><span>Mori House</span><span>Hospitality · Example direction</span></figcaption></figure></div></section>

    <section className="mk-process" id="process"><div className="mk-container"><div className="mk-section-head"><span className="mk-kicker">Process</span><h2 className="mk-display">Four clear stages.<br/>Nothing to decode.</h2></div><div className="mk-process-rail"><div className="mk-process-line"><i className="mk-process-progress"/></div>{[["01","Direction","Show us what you mean."],["02","Build","We turn it into the site."],["03","Review","Comment on the real website."],["04","Live","Approve, connect and launch."]].map(([n,t,c])=><div className="mk-process-step" key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></div>)}</div></div></section>

    <section className="mk-portal" id="portal"><div className="mk-container"><div className="mk-portal-head"><h2 className="mk-display">The website stays<br/><em>in the middle.</em></h2><p className="mk-body">Explore the Fourthform portal. Resize the site, switch pages, add a Direction or replace an image. This interactive preview uses example data.</p></div><div className="mk-preview-shell"><div className="mk-preview-top"><span>Interactive portal preview</span><span>Example data · <Link href="/preview">Open full preview ↗</Link></span></div><iframe className="mk-portal-frame" src="/portal-preview/index.html" title="Interactive Fourthform portal preview" loading="lazy"/></div></div></section>

    <section className="mk-states" id="states"><div className="mk-states-pin"><div className="mk-container mk-states-grid"><div className="mk-states-copy"><span className="mk-kicker">States · Pro</span><h2 className="mk-display">Monday isn’t<br/><em>Saturday.</em></h2><p className="mk-body">A Monday menu. A longer Saturday lunch. Scheduled States let the website change with the moment, then return to its default. Explore this Pro concept in the preview.</p><div className="mk-state-label"><span>Monday</span><span>Saturday</span></div></div><div className="mk-state-object"><iframe tabIndex={-1} className="mk-state-frame mk-state-monday" title="Mori House on Monday" sandbox="allow-same-origin" srcDoc={monday}/><iframe tabIndex={-1} className="mk-state-frame mk-state-saturday" title="Mori House on Saturday" sandbox="allow-same-origin" srcDoc={saturday}/></div></div></div></section>

    <section className="mk-pricing" id="pricing"><div className="mk-container"><div className="mk-pricing-head"><h2 className="mk-display">A website costs<br/><em>A$1,500.</em></h2><p className="mk-body">A$200 starts the project. A$1,300 is due when you approve the finished website for launch.</p></div><div className="mk-price-line"><span>Site</span><strong>A$1,500 <small>once</small></strong><p>Up to 5 custom pages, responsive design, forms, initial SEO, analytics, the client portal, Core and three revision rounds.</p></div><div className="mk-price-secondary"><div><span>Core</span><strong>Included</strong><p>Everything needed to own and manage the site after launch.</p></div><div><span>Pro</span><strong>A$39 / month</strong><p>States, deeper analytics, heatmaps and automated recommendations.</p></div></div><div className="mk-first"><span>Fourthform First</span><p>For genuinely new businesses, a smaller one-page scope. <a href="/preview/start?package=first">Explore First ↗</a></p><strong>A$199</strong></div></div></section>

    <section className="mk-final"><div className="mk-container mk-final-grid"><h2 className="mk-display">Bring it<br/><em>into form.</em></h2><div><p className="mk-body">Start with the business, the references, the rough ideas and the things you already have.</p><a className="mk-button mk-button-dark" href="/preview/start">Start a site</a></div></div></section>
    <section className="mk-faq" id="questions"><div className="mk-container mk-faq-grid"><div><span className="mk-kicker">A little clarity</span><h2 className="mk-display">Before it<br/><em>takes form.</em></h2></div><div className="mk-faq-list"><details><summary>What starts the project?<span aria-hidden="true">+</span></summary><p>A$200 starts a Fourthform Site. You share a short business brief and your Initial Direction, then the website takes shape with you.</p></details><details><summary>How do Directions work?<span aria-hidden="true">+</span></summary><p>A Direction brings your words, images, links or drawings together in the portal. During Review, you can point to the exact part of the website you want changed.</p></details><details><summary>How many revision rounds are included?<span aria-hidden="true">+</span></summary><p>Site includes three revision rounds. First includes one. Initial Direction does not use a round, and a revision can contain any number of Directions.</p></details><details><summary>When is the remaining payment due?<span aria-hidden="true">+</span></summary><p>For Site, the A$1,300 balance is due when you approve the finished website for launch. The total is A$1,500. First is a smaller A$199 package.</p></details><details><summary>Do I need Pro?<span aria-hidden="true">+</span></summary><p>Core is included after launch. Pro is optional at A$39 per month for scheduled States and deeper insights. You can explore both in the preview.</p></details><details><summary>Can I try the portal first?<span aria-hidden="true">+</span></summary><p>Yes. The portal is an interactive example with browser-local drafts. No account, card details or payment are needed to explore it.</p></details></div></div></section>
    <footer className="mk-footer"><div className="mk-container"><b>fourthform</b><span>Websites, brought into form.</span><span>Brisbane, Australia</span></div></footer>
  </main>
}
