"use client";
import {startHref} from "../../lib/customer-flow";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import type {PortfolioProject} from "../../lib/portfolio/projects";

export default function ProjectDialog({project, onClose, onNavigate, position, total}: {project:PortfolioProject|null;onClose:()=>void;onNavigate:(delta:number)=>void;position:number;total:number}) {
  const ref=useRef<HTMLDialogElement>(null),media=useRef<HTMLDivElement>(null);
  const [still,setStill]=useState(false);
  const open=!!project;
  useEffect(()=>{
    const dialog=ref.current;if(!dialog)return;
    if(!open){if(dialog.open)dialog.close();return;}
    const previous=document.documentElement.style.overflow;
    document.documentElement.style.overflow="hidden";
    if(!dialog.open)dialog.showModal();
    return()=>{document.documentElement.style.overflow=previous;if(dialog.open)dialog.close();};
  },[open]);
  useEffect(()=>{setStill(false);media.current?.scrollTo({top:0});},[project?.id]);
  return <dialog ref={ref} className="work-dialog" aria-labelledby="work-dialog-title" aria-describedby="work-dialog-description" data-lenis-prevent onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}} onKeyDown={event=>{if((event.target as Element).closest("video"))return;if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();onNavigate(event.key==="ArrowRight"?1:-1);}}}>
    {project&&<div className="work-dialog-layout">
      <header className="work-dialog-top"><span>Selected design · {String(position+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span><button type="button" onClick={onClose} autoFocus aria-label="Close design preview">Close <span aria-hidden="true">×</span></button></header>
      <div className="work-dialog-media" ref={media} data-lenis-prevent>{still?<img src={project.image} width={project.width} height={project.height} alt={`${project.title}, website design overview`}/>:<iframe key={project.id} src={`/work/${project.id}`} title={`${project.title} live website concept`} loading="eager"/>}</div>
      <div className="work-dialog-copy"><span className="mk-kicker">{project.sector} · {project.group}</span><h2 id="work-dialog-title">{project.title}</h2><p className="work-dialog-line">{project.line}</p><p id="work-dialog-description">{project.description}</p><div className="work-dialog-techniques"><span className="mk-kicker">The design language</span><ul>{project.techniques.map(technique=><li key={technique}>{technique}</li>)}</ul></div><p className="work-live-label">Browse the page, explore the sections and try an enquiry. The business is fictional; no message is sent.</p><button type="button" className="work-play" aria-pressed={still} onClick={()=>setStill(value=>!value)}>{still?"Explore the live website":"Show the design overview"}<span aria-hidden="true">↗</span></button><a className="work-source" href={`/work/${project.id}`} target="_blank" rel="noopener noreferrer">Open the live website ↗</a><p className="work-dialog-disclosure">A Fourthform studio concept. Your website will use your own business, words, imagery and goals.</p></div>
      <footer className="work-dialog-bottom"><button type="button" onClick={()=>onNavigate(-1)} aria-label="Previous design"><span aria-hidden="true">←</span><span className="work-navigation-label">Previous</span></button><span className="work-keyboard-hint">Use ← → to explore</span><Link className="mk-button mk-button-dark work-reference" href={startHref({reference:project.id})}>Use this reference ↗</Link><button type="button" onClick={()=>onNavigate(1)} aria-label="Next design"><span className="work-navigation-label">Next</span><span aria-hidden="true">→</span></button></footer>
    </div>}
  </dialog>;
}
