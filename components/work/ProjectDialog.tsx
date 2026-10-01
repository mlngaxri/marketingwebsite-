"use client";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import type {PortfolioProject} from "../../lib/portfolio/projects";

export default function ProjectDialog({project, onClose, onNavigate, position, total}: {project:PortfolioProject|null;onClose:()=>void;onNavigate:(delta:number)=>void;position:number;total:number}) {
  const ref=useRef<HTMLDialogElement>(null),media=useRef<HTMLDivElement>(null);
  const [playing,setPlaying]=useState(false);
  const open=!!project;
  useEffect(()=>{
    const dialog=ref.current;if(!dialog)return;
    if(!open){if(dialog.open)dialog.close();return;}
    const previous=document.documentElement.style.overflow;
    document.documentElement.style.overflow="hidden";
    if(!dialog.open)dialog.showModal();
    return()=>{document.documentElement.style.overflow=previous;if(dialog.open)dialog.close();};
  },[open]);
  useEffect(()=>{setPlaying(false);media.current?.scrollTo({top:0});},[project?.id]);
  return <dialog ref={ref} className="work-dialog" aria-labelledby="work-dialog-title" aria-describedby="work-dialog-description" data-lenis-prevent onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}} onKeyDown={event=>{if((event.target as Element).closest("video"))return;if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();onNavigate(event.key==="ArrowRight"?1:-1);}}}>
    {project&&<div className="work-dialog-layout">
      <header className="work-dialog-top"><span>Selected design · {String(position+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span><button type="button" onClick={onClose} autoFocus aria-label="Close design preview">Close <span aria-hidden="true">×</span></button></header>
      <div className="work-dialog-media" ref={media} data-lenis-prevent>{playing&&project.video?<video key={project.id} controls playsInline autoPlay preload="none" poster={project.image} src={project.video} aria-label={`${project.title} motion preview`}/>:<img src={project.image} width={project.width} height={project.height} alt={`${project.title}, full website design preview`}/>}</div>
      <div className="work-dialog-copy"><span className="mk-kicker">{project.sector} · {project.group}</span><h2 id="work-dialog-title">{project.title}</h2><p className="work-dialog-line">{project.line}</p><p id="work-dialog-description">{project.description}</p><div className="work-dialog-techniques"><span className="mk-kicker">The design language</span><ul>{project.techniques.map(technique=><li key={technique}>{technique}</li>)}</ul></div>{project.video&&<button type="button" className="work-play" aria-pressed={playing} onClick={()=>setPlaying(value=>!value)}>{playing?"Back to still preview":"Play motion preview"}<span aria-hidden="true">{playing?"↶":"▷"}</span></button>}<Link className="mk-button mk-button-dark work-reference" href={`/preview/start?reference=${project.id}`}>Start with this reference ↗</Link><a className="work-source" href={project.source} target="_blank" rel="noopener noreferrer">View on MotionSites ↗</a><p className="work-dialog-disclosure">A design study from the MotionSites portfolio. We’ll shape your website around your own business, content and goals.</p></div>
      <footer className="work-dialog-bottom"><button type="button" onClick={()=>onNavigate(-1)} aria-label="Previous design">← Previous</button><span>Use ← → to explore</span><button type="button" onClick={()=>onNavigate(1)} aria-label="Next design">Next →</button></footer>
    </div>}
  </dialog>;
}
