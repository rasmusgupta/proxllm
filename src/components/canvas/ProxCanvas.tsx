'use client';

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'kc-proxcanvas-shell': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        id?: string;
        style?: React.CSSProperties;
      }, HTMLElement>;
    }
  }
}

export function ProxCanvas() {
  useEffect(() => {
    // Add custom styles for proxcanvas without loading the conflicting style.css
    const style = document.createElement('style');
    style.textContent = `
      /* Import necessary fonts */
      @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
      @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap");
      
      /* Essential proxcanvas styles without the problematic ones */
      kc-proxcanvas-shell {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        overflow: hidden;
      }
      
      /* Ensure proxcanvas-embed works if used */
      proxcanvas-embed {
        display: block;
        width: 100%;
        max-height: 100%;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Cleanup on unmount
      if (style.parentNode) document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="h-full w-full bg-background border-l" style={{ position: 'relative', overflow: 'hidden' }}>
      <Script 
        src="/proxcanvas/proxcanvas.js" 
        strategy="afterInteractive"
        type="module"
      />
      
      <kc-proxcanvas-shell 
        id="proxcanvas" 
        style={{ 
          width: '100%', 
          height: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
    </div>
  );
}