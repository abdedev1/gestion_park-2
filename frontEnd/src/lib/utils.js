import { clsx } from "clsx";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const useRemover = ({className,show,setShow}) => {
  
  useEffect(() => {
      if(!show) return
      const cOverlay = (e) => {
          const overlay = document.querySelector(`.${className}`)
          if(overlay && !overlay.contains(e.target)) {
              setShow(false)
          }
      }

      document.addEventListener("click",cOverlay)
      return () => document.removeEventListener("click",cOverlay)
  },[show])
}