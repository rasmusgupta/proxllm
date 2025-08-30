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
    // Add custom styles for proxcanvas with VS Code theme colors
    const style = document.createElement('style');
    style.textContent = `
      /* Import necessary fonts */
      @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
      @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap");
      
      /* Essential proxcanvas styles */
      kc-proxcanvas-shell {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        overflow: hidden;
        
        /* VS Code Theme Colors Override */
        --bg: #1e1e1e !important; /* VS Code main background */
        --fg: #d4d4d4 !important; /* VS Code main text */
        
        --activity-bar-bg: #252526 !important; /* VS Code secondary background */
        --activity-bar-fg: #d4d4d4 !important;
        --activity-bar-active-bg: #1e1e1e !important;
        --activity-bar-active-fg: #d4d4d4 !important;
        
        --panel-bg: #1e1e1e !important;
        --panel-fg: #d4d4d4 !important;
        --panel-border: 2px solid #3e3e42 !important; /* VS Code border */
        --panel-title-bg: #2d2d30 !important; /* VS Code menu background */
        --panel-title-fg: #d4d4d4 !important;
        --panel-title-border: 1px solid #3e3e42 !important;
        --panel-title-button-bg: transparent !important;
        --panel-title-button-fg: #cccccc !important;
        --panel-title-button-hover-bg: #007acc !important; /* VS Code blue */
        --panel-title-button-hover-fg: #ffffff !important;
        --panel-subtitle-bg: #2d2d30 !important;
        --panel-subtitle-fg: #d4d4d4 !important;
        
        --button-bg: #007acc !important; /* VS Code blue */
        --button-fg: #ffffff !important;
        --button-hover-bg: #1177bb !important;
        --button-hover-fg: #ffffff !important;
        --button-focus-outline: 1px solid #007acc !important;
        --button-selected-bg: #094771 !important; /* VS Code selection */
        --button-selected-fg: #ffffff !important;
        --button-disabled-bg: #3c3c3c !important; /* VS Code input bg */
        --button-disabled-fg: #858585 !important; /* VS Code muted text */
        
        --input-bg: #3c3c3c !important; /* VS Code input background */
        --input-fg: #d4d4d4 !important;
        --input-border: 1px solid #3e3e42 !important;
        --input-accent: #007acc !important;
        --input-placeholder: #858585 !important;
        
        --dropdown-bg: #2d2d30 !important;
        --dropdown-fg: #d4d4d4 !important;
        
        --scrollbar-bg: #1e1e1e !important;
        --scrollbar-fg: #858585 !important;
        --scrollbar-active-fg: #007acc !important;
        --scrollbar-hover-bg: #094771 !important;
        
        --resizer-bg: #007acc !important;
        --resizer-active-bg: #1177bb !important;
        
        --tooltip-bg: #2d2d30 !important;
        --tooltip-fg: #d4d4d4 !important;
        --tooltip-border: 1px solid #3e3e42 !important;
        
        /* Additional purple color overrides */
        --input-range-bg: #3e3e42 !important; /* VS Code border for sliders */
        --input-range-fg: #d4d4d4 !important;
        --input-range-hover-bg: #007acc !important; /* VS Code blue */
        --input-range-disabled-bg: #1e1e1e !important;
        --input-range-handle-shadow: 1px 1px 5px 5px rgba(0, 122, 204, 0.2) !important; /* Blue shadow */
        
        --list-item-bg: transparent !important;
        --list-item-fg: #d4d4d4 !important;
        --list-item-hover-bg: #2d2d30 !important; /* VS Code menu background */
        --list-item-active-bg: #094771 !important; /* VS Code selection */
        --list-item-active-fg: #ffffff !important;
        
        --focus-overlay-bg: #007acc !important;
        --focus-overlay-opacity: 0.3 !important;
        
        /* Override gradients with solid VS Code colors */
        --gradient-purple-green-light: #2d2d30 !important;
        --gradient-purple-blue-medium: #252526 !important;
        --gradient-purple-blue-dark: #1e1e1e !important;
        --gradient-cyan-blue-light: #094771 !important;
        --gradient-purple-green-highlight: #007acc !important;
        --gradient-purple-red: #007acc !important;
        --gradient-purple-red-highlight: #1177bb !important;
        
        /* Button variants */
        --button-toolbar-bg: #252526 !important;
        --button-toolbar-fg: #d4d4d4 !important;
        --button-toolbar-hover-bg: #2d2d30 !important;
        --button-toolbar-hover-fg: #007acc !important;
        --button-toolbar-disabled-bg: #1e1e1e !important;
        --button-toolbar-disabled-fg: #858585 !important;
        
        --button-toolbar-alt-bg: #2d2d30 !important;
        --button-toolbar-alt-fg: #d4d4d4 !important;
        --button-toolbar-alt-hover-bg: #007acc !important;
        --button-toolbar-alt-hover-fg: #ffffff !important;
        --button-toolbar-alt-disabled-bg: #1e1e1e !important;
        --button-toolbar-alt-disabled-fg: #858585 !important;
        
        /* Dropdown variants */
        --dropdown-hover-bg: #007acc !important;
        --dropdown-hover-fg: #ffffff !important;
        --dropdown-active-bg: #094771 !important;
        --dropdown-active-fg: #ffffff !important;
      }
      
      /* Specific slider styling for blue fill over gray background */
      kc-proxcanvas-shell input[type="range"] {
        background: #3e3e42 !important; /* Gray background */
        -webkit-appearance: none !important;
        appearance: none !important;
        height: 6px !important;
        border-radius: 3px !important;
      }
      
      kc-proxcanvas-shell input[type="range"]::-webkit-slider-track {
        background: #3e3e42 !important; /* Gray track */
        height: 6px !important;
        border-radius: 3px !important;
      }
      
      kc-proxcanvas-shell input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        appearance: none !important;
        height: 14px !important;
        width: 14px !important;
        border-radius: 50% !important;
        background: #007acc !important; /* Blue thumb */
        border: 2px solid #ffffff !important;
        cursor: pointer !important;
        box-shadow: 0 0 3px rgba(0, 122, 204, 0.5) !important;
      }
      
      kc-proxcanvas-shell input[type="range"]::-moz-range-track {
        background: #3e3e42 !important; /* Gray track */
        height: 6px !important;
        border-radius: 3px !important;
        border: none !important;
      }
      
      kc-proxcanvas-shell input[type="range"]::-moz-range-thumb {
        height: 14px !important;
        width: 14px !important;
        border-radius: 50% !important;
        background: #007acc !important; /* Blue thumb */
        border: 2px solid #ffffff !important;
        cursor: pointer !important;
        box-shadow: 0 0 3px rgba(0, 122, 204, 0.5) !important;
      }
      
      /* Progress fill effect for sliders */
      kc-proxcanvas-shell input[type="range"]::-webkit-slider-runnable-track {
        background: linear-gradient(to right, #007acc 0%, #007acc var(--progress, 50%), #3e3e42 var(--progress, 50%), #3e3e42 100%) !important;
        height: 6px !important;
        border-radius: 3px !important;
      }
      
      /* Custom slider containers if they exist */
      kc-proxcanvas-shell .slider-container,
      kc-proxcanvas-shell kc-ui-slider {
        --slider-bg: #3e3e42 !important;
        --slider-fill: #007acc !important;
        --slider-thumb: #007acc !important;
      }
      
      /* Any custom slider elements */
      kc-proxcanvas-shell [class*="slider"] [class*="fill"],
      kc-proxcanvas-shell [class*="range"] [class*="fill"],
      kc-proxcanvas-shell .progress-bar,
      kc-proxcanvas-shell .fill-bar {
        background: #007acc !important;
      }
      
      /* Scrollbar styling - make them blue */
      kc-proxcanvas-shell ::-webkit-scrollbar {
        width: 8px !important;
        height: 8px !important;
        background: #1e1e1e !important; /* VS Code background */
      }
      
      kc-proxcanvas-shell ::-webkit-scrollbar-track {
        background: #1e1e1e !important; /* VS Code background */
        border-radius: 4px !important;
      }
      
      kc-proxcanvas-shell ::-webkit-scrollbar-thumb {
        background: #858585 !important; /* VS Code muted text color */
        border-radius: 4px !important;
        border: 1px solid #3e3e42 !important;
      }
      
      kc-proxcanvas-shell ::-webkit-scrollbar-thumb:hover {
        background: #007acc !important; /* Blue on hover */
      }
      
      kc-proxcanvas-shell ::-webkit-scrollbar-thumb:active {
        background: #1177bb !important; /* Darker blue when active */
      }
      
      kc-proxcanvas-shell ::-webkit-scrollbar-corner {
        background: #1e1e1e !important;
      }
      
      /* Firefox scrollbars */
      kc-proxcanvas-shell * {
        scrollbar-width: thin !important;
        scrollbar-color: #858585 #1e1e1e !important;
      }
      
      /* Divider lines and separators */
      kc-proxcanvas-shell hr,
      kc-proxcanvas-shell .divider,
      kc-proxcanvas-shell .separator,
      kc-proxcanvas-shell [class*="divider"],
      kc-proxcanvas-shell [class*="separator"],
      kc-proxcanvas-shell .border-top,
      kc-proxcanvas-shell .border-bottom,
      kc-proxcanvas-shell .border-left,
      kc-proxcanvas-shell .border-right {
        border-color: #3e3e42 !important; /* VS Code border color */
        background-color: #3e3e42 !important;
      }
      
      /* Panel and section borders */
      kc-proxcanvas-shell .panel,
      kc-proxcanvas-shell .section,
      kc-proxcanvas-shell [class*="panel"],
      kc-proxcanvas-shell [class*="section"] {
        border-color: #3e3e42 !important;
      }
      
      /* Tab and navigation borders */
      kc-proxcanvas-shell .tab,
      kc-proxcanvas-shell .nav,
      kc-proxcanvas-shell [class*="tab"],
      kc-proxcanvas-shell [class*="nav"] {
        border-color: #3e3e42 !important;
      }
      
      /* Active/selected tab borders - make them blue */
      kc-proxcanvas-shell .tab.active,
      kc-proxcanvas-shell .tab.selected,
      kc-proxcanvas-shell [class*="tab"].active,
      kc-proxcanvas-shell [class*="tab"].selected,
      kc-proxcanvas-shell .active,
      kc-proxcanvas-shell .selected {
        border-color: #007acc !important;
        border-bottom-color: #007acc !important;
        box-shadow: inset 0 -2px 0 #007acc !important;
      }
      
      /* Progress bars and loading indicators */
      kc-proxcanvas-shell .progress,
      kc-proxcanvas-shell [class*="progress"],
      kc-proxcanvas-shell .loading,
      kc-proxcanvas-shell [class*="loading"] {
        background: #007acc !important;
      }
      
      /* Accent colors and highlights */
      kc-proxcanvas-shell .accent,
      kc-proxcanvas-shell [class*="accent"],
      kc-proxcanvas-shell .highlight,
      kc-proxcanvas-shell [class*="highlight"] {
        color: #007acc !important;
        border-color: #007acc !important;
      }
      
      /* AGGRESSIVE PURPLE REPLACEMENT - Replace ALL purple colors with blue */
      kc-proxcanvas-shell * {
        /* Replace specific purple hex values */
        background-image: none !important;
      }
      
      /* Target any element with purple background colors */
      kc-proxcanvas-shell *[style*="#ae81ff"],
      kc-proxcanvas-shell *[style*="#8864cb"],
      kc-proxcanvas-shell *[style*="#8077a8"],
      kc-proxcanvas-shell *[style*="#634e89"],
      kc-proxcanvas-shell *[style*="purple"],
      kc-proxcanvas-shell *[style*="magenta"],
      kc-proxcanvas-shell *[style*="violet"] {
        background-color: #007acc !important;
        color: #ffffff !important;
      }
      
      /* Replace any purple border colors */
      kc-proxcanvas-shell *[style*="border-color: #ae81ff"],
      kc-proxcanvas-shell *[style*="border-color: #8864cb"],
      kc-proxcanvas-shell *[style*="border-color: #8077a8"],
      kc-proxcanvas-shell *[style*="border-color: #634e89"],
      kc-proxcanvas-shell *[style*="border: 1px solid #ae81ff"],
      kc-proxcanvas-shell *[style*="border: 2px solid #ae81ff"] {
        border-color: #007acc !important;
      }
      
      /* Force override any computed purple colors */
      kc-proxcanvas-shell * {
        filter: hue-rotate(0deg) !important;
      }
      
      /* Replace purple gradients and backgrounds using content replacement */
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="#ae81ff"],
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="#8864cb"],
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="purple"] {
        background: #007acc !important;
      }
      
      /* Force all elements with purple-like colors to be blue */
      kc-proxcanvas-shell * {
        color: var(--color-override, inherit) !important;
        background-color: var(--bg-override, inherit) !important;
        border-color: var(--border-override, inherit) !important;
      }
      
      /* Set overrides for purple elements */
      kc-proxcanvas-shell *[style*="#ae81ff"] {
        --color-override: #ffffff !important;
        --bg-override: #007acc !important;
        --border-override: #007acc !important;
      }
      
      kc-proxcanvas-shell *[style*="#8864cb"] {
        --color-override: #ffffff !important;
        --bg-override: #007acc !important;
        --border-override: #007acc !important;
      }
      
      kc-proxcanvas-shell *[style*="#8077a8"] {
        --color-override: #ffffff !important;
        --bg-override: #2d2d30 !important;
        --border-override: #3e3e42 !important;
      }
      
      kc-proxcanvas-shell *[style*="#634e89"] {
        --color-override: #ffffff !important;
        --bg-override: #094771 !important;
        --border-override: #007acc !important;
      }
      
      /* Apply CSS filter to shift purple hues to blue */
      kc-proxcanvas-shell {
        filter: hue-rotate(180deg) saturate(0.8) !important;
      }
      
      /* Restore non-purple colors back to normal after hue rotation */
      kc-proxcanvas-shell * {
        filter: hue-rotate(-180deg) !important;
      }
      
      /* Keep blue elements blue after double rotation */
      kc-proxcanvas-shell *[style*="#007acc"],
      kc-proxcanvas-shell *[style*="blue"],
      kc-proxcanvas-shell .button,
      kc-proxcanvas-shell button {
        filter: none !important;
      }
      
      /* ORANGE COLOR REPLACEMENT - Replace ALL orange colors with blue */
      
      /* Target any element with orange background colors */
      kc-proxcanvas-shell *[style*="#ff6600"],
      kc-proxcanvas-shell *[style*="#ff7700"],
      kc-proxcanvas-shell *[style*="#ff8800"],
      kc-proxcanvas-shell *[style*="#ff9900"],
      kc-proxcanvas-shell *[style*="#ffaa00"],
      kc-proxcanvas-shell *[style*="#ffbb00"],
      kc-proxcanvas-shell *[style*="#ffcc00"],
      kc-proxcanvas-shell *[style*="#ffa500"],
      kc-proxcanvas-shell *[style*="#ff8c00"],
      kc-proxcanvas-shell *[style*="#ff7f00"],
      kc-proxcanvas-shell *[style*="orange"],
      kc-proxcanvas-shell *[style*="darkorange"],
      kc-proxcanvas-shell *[style*="orangered"] {
        background-color: #007acc !important;
        color: #ffffff !important;
      }
      
      /* Replace any orange border colors */
      kc-proxcanvas-shell *[style*="border-color: #ff"],
      kc-proxcanvas-shell *[style*="border-color: orange"],
      kc-proxcanvas-shell *[style*="border: 1px solid #ff"],
      kc-proxcanvas-shell *[style*="border: 2px solid #ff"] {
        border-color: #007acc !important;
      }
      
      /* Set overrides for orange elements */
      kc-proxcanvas-shell *[style*="#ff6600"],
      kc-proxcanvas-shell *[style*="#ff7700"],
      kc-proxcanvas-shell *[style*="#ff8800"],
      kc-proxcanvas-shell *[style*="#ff9900"],
      kc-proxcanvas-shell *[style*="#ffa500"],
      kc-proxcanvas-shell *[style*="orange"] {
        --color-override: #ffffff !important;
        --bg-override: #007acc !important;
        --border-override: #007acc !important;
      }
      
      /* Replace orange gradients */
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="#ff"],
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="orange"],
      kc-proxcanvas-shell *[style*="radial-gradient"][style*="#ff"],
      kc-proxcanvas-shell *[style*="radial-gradient"][style*="orange"] {
        background: #007acc !important;
      }
      
      /* Target common orange UI elements */
      kc-proxcanvas-shell .warning,
      kc-proxcanvas-shell .alert,
      kc-proxcanvas-shell [class*="warning"],
      kc-proxcanvas-shell [class*="alert"],
      kc-proxcanvas-shell [class*="orange"] {
        background-color: #007acc !important;
        color: #ffffff !important;
        border-color: #007acc !important;
      }
      
      /* Override SVG fill and stroke colors for orange */
      kc-proxcanvas-shell svg [fill*="#ff"],
      kc-proxcanvas-shell svg [fill*="orange"],
      kc-proxcanvas-shell svg [stroke*="#ff"],
      kc-proxcanvas-shell svg [stroke*="orange"] {
        fill: #007acc !important;
        stroke: #007acc !important;
      }
      
      /* Override CSS custom properties that might contain orange and yellow */
      kc-proxcanvas-shell {
        --warning-color: #007acc !important;
        --alert-color: #007acc !important;
        --orange-color: #007acc !important;
        --accent-orange: #007acc !important;
        --highlight-orange: #007acc !important;
        
        /* Yellow color variables */
        --yellow-color: #007acc !important;
        --gold-color: #007acc !important;
        --amber-color: #007acc !important;
        --warning-yellow: #007acc !important;
        --alert-yellow: #007acc !important;
        --highlight-yellow: #007acc !important;
        --accent-yellow: #007acc !important;
        --selection-yellow: #007acc !important;
        --focus-yellow: #007acc !important;
      }
      
      /* Catch any remaining orange colors with broader selectors */
      kc-proxcanvas-shell * {
        /* Replace any computed orange colors */
        color: inherit !important;
      }
      
      kc-proxcanvas-shell *[class*="orange"],
      kc-proxcanvas-shell *[id*="orange"] {
        background-color: #007acc !important;
        color: #ffffff !important;
        border-color: #007acc !important;
      }
      
      /* COMPREHENSIVE YELLOW COLOR REPLACEMENT - Replace ALL yellow colors with blue */
      
      /* Target yellow hex color ranges */
      kc-proxcanvas-shell *[style*="#fff000"],
      kc-proxcanvas-shell *[style*="#fff100"],
      kc-proxcanvas-shell *[style*="#fff200"],
      kc-proxcanvas-shell *[style*="#fff300"],
      kc-proxcanvas-shell *[style*="#fff400"],
      kc-proxcanvas-shell *[style*="#fff500"],
      kc-proxcanvas-shell *[style*="#fff600"],
      kc-proxcanvas-shell *[style*="#fff700"],
      kc-proxcanvas-shell *[style*="#fff800"],
      kc-proxcanvas-shell *[style*="#fff900"],
      kc-proxcanvas-shell *[style*="#fffa00"],
      kc-proxcanvas-shell *[style*="#fffb00"],
      kc-proxcanvas-shell *[style*="#fffc00"],
      kc-proxcanvas-shell *[style*="#fffd00"],
      kc-proxcanvas-shell *[style*="#fffe00"],
      kc-proxcanvas-shell *[style*="#ffff00"],
      kc-proxcanvas-shell *[style*="#ffff11"],
      kc-proxcanvas-shell *[style*="#ffff22"],
      kc-proxcanvas-shell *[style*="#ffff33"],
      kc-proxcanvas-shell *[style*="#ffff44"],
      kc-proxcanvas-shell *[style*="#ffff55"],
      kc-proxcanvas-shell *[style*="#ffff66"],
      kc-proxcanvas-shell *[style*="#ffff77"],
      kc-proxcanvas-shell *[style*="#ffff88"],
      kc-proxcanvas-shell *[style*="#ffff99"] {
        background-color: #007acc !important;
        color: #ffffff !important;
        border-color: #007acc !important;
      }
      
      /* Target golden/amber hex colors */
      kc-proxcanvas-shell *[style*="#ffd000"],
      kc-proxcanvas-shell *[style*="#ffd100"],
      kc-proxcanvas-shell *[style*="#ffd200"],
      kc-proxcanvas-shell *[style*="#ffd300"],
      kc-proxcanvas-shell *[style*="#ffd400"],
      kc-proxcanvas-shell *[style*="#ffd500"],
      kc-proxcanvas-shell *[style*="#ffd600"],
      kc-proxcanvas-shell *[style*="#ffd700"],
      kc-proxcanvas-shell *[style*="#ffd800"],
      kc-proxcanvas-shell *[style*="#ffd900"],
      kc-proxcanvas-shell *[style*="#ffda00"],
      kc-proxcanvas-shell *[style*="#ffdb00"],
      kc-proxcanvas-shell *[style*="#ffdc00"],
      kc-proxcanvas-shell *[style*="#ffdd00"],
      kc-proxcanvas-shell *[style*="#ffde00"],
      kc-proxcanvas-shell *[style*="#ffdf00"],
      kc-proxcanvas-shell *[style*="#ffe000"],
      kc-proxcanvas-shell *[style*="#ffe100"],
      kc-proxcanvas-shell *[style*="#ffe200"],
      kc-proxcanvas-shell *[style*="#ffe300"],
      kc-proxcanvas-shell *[style*="#ffe400"],
      kc-proxcanvas-shell *[style*="#ffe500"],
      kc-proxcanvas-shell *[style*="#ffe600"],
      kc-proxcanvas-shell *[style*="#ffe700"],
      kc-proxcanvas-shell *[style*="#ffe800"],
      kc-proxcanvas-shell *[style*="#ffe900"],
      kc-proxcanvas-shell *[style*="#ffea00"],
      kc-proxcanvas-shell *[style*="#ffeb00"],
      kc-proxcanvas-shell *[style*="#ffec00"],
      kc-proxcanvas-shell *[style*="#ffed00"],
      kc-proxcanvas-shell *[style*="#ffee00"],
      kc-proxcanvas-shell *[style*="#ffef00"] {
        background-color: #007acc !important;
        color: #ffffff !important;
        border-color: #007acc !important;
      }
      
      /* Target additional orange-pink variants found in source */
      kc-proxcanvas-shell *[style*="#ff80ac"],
      kc-proxcanvas-shell *[style*="#ff81ad"],
      kc-proxcanvas-shell *[style*="#ff82ae"],
      kc-proxcanvas-shell *[style*="#ff83af"],
      kc-proxcanvas-shell *[style*="#ff84b0"],
      kc-proxcanvas-shell *[style*="#ff85b1"],
      kc-proxcanvas-shell *[style*="#ff86b2"],
      kc-proxcanvas-shell *[style*="#ff87b3"],
      kc-proxcanvas-shell *[style*="#ff88b4"],
      kc-proxcanvas-shell *[style*="#ff89b5"],
      kc-proxcanvas-shell *[style*="#ff8ab6"],
      kc-proxcanvas-shell *[style*="#ff8bb7"],
      kc-proxcanvas-shell *[style*="#ff8cb8"],
      kc-proxcanvas-shell *[style*="#ff8db9"],
      kc-proxcanvas-shell *[style*="#ff8eba"],
      kc-proxcanvas-shell *[style*="#ff8fbb"] {
        background-color: #007acc !important;
        color: #ffffff !important;
        border-color: #007acc !important;
      }
      
      /* TARGET YELLOW CSS COLOR NAMES */
      kc-proxcanvas-shell *[style*="yellow"],
      kc-proxcanvas-shell *[style*="gold"],
      kc-proxcanvas-shell *[style*="amber"],
      kc-proxcanvas-shell *[style*="khaki"],
      kc-proxcanvas-shell *[style*="lightyellow"],
      kc-proxcanvas-shell *[style*="lightgoldenrodyellow"],
      kc-proxcanvas-shell *[style*="palegoldenrod"],
      kc-proxcanvas-shell *[style*="goldenrod"],
      kc-proxcanvas-shell *[style*="darkgoldenrod"],
      kc-proxcanvas-shell *[style*="lemonchiffon"],
      kc-proxcanvas-shell *[style*="cornsilk"],
      kc-proxcanvas-shell *[style*="papayawhip"],
      kc-proxcanvas-shell *[style*="moccasin"],
      kc-proxcanvas-shell *[style*="navajowhite"],
      kc-proxcanvas-shell *[style*="peachpuff"],
      kc-proxcanvas-shell *[style*="sandybrown"],
      kc-proxcanvas-shell *[style*="burlywood"] {
        background-color: #007acc !important;
        color: #ffffff !important;
        border-color: #007acc !important;
      }
      
      /* TARGET YELLOW/ORANGE CLASS NAMES AND IDS */
      kc-proxcanvas-shell *[class*="yellow"],
      kc-proxcanvas-shell *[class*="gold"],
      kc-proxcanvas-shell *[class*="amber"],
      kc-proxcanvas-shell *[class*="warning"],
      kc-proxcanvas-shell *[class*="caution"],
      kc-proxcanvas-shell *[class*="highlight"],
      kc-proxcanvas-shell *[class*="selection"],
      kc-proxcanvas-shell *[class*="focus"],
      kc-proxcanvas-shell *[id*="yellow"],
      kc-proxcanvas-shell *[id*="gold"],
      kc-proxcanvas-shell *[id*="amber"],
      kc-proxcanvas-shell *[id*="warning"],
      kc-proxcanvas-shell *[id*="highlight"] {
        background-color: #007acc !important;
        color: #ffffff !important;
        border-color: #007acc !important;
      }
      
      /* ENHANCED SVG TARGETING FOR YELLOW/ORANGE */
      kc-proxcanvas-shell svg [fill*="#fff"],
      kc-proxcanvas-shell svg [fill*="#ffd"],
      kc-proxcanvas-shell svg [fill*="#ffe"],
      kc-proxcanvas-shell svg [fill*="yellow"],
      kc-proxcanvas-shell svg [fill*="gold"],
      kc-proxcanvas-shell svg [fill*="amber"],
      kc-proxcanvas-shell svg [stroke*="#fff"],
      kc-proxcanvas-shell svg [stroke*="#ffd"],
      kc-proxcanvas-shell svg [stroke*="#ffe"],
      kc-proxcanvas-shell svg [stroke*="yellow"],
      kc-proxcanvas-shell svg [stroke*="gold"],
      kc-proxcanvas-shell svg [stroke*="amber"] {
        fill: #007acc !important;
        stroke: #007acc !important;
      }
      
      /* ENHANCED GRADIENT REPLACEMENT FOR YELLOW/ORANGE */
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="#fff"],
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="#ffd"],
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="#ffe"],
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="yellow"],
      kc-proxcanvas-shell *[style*="linear-gradient"][style*="gold"],
      kc-proxcanvas-shell *[style*="radial-gradient"][style*="#fff"],
      kc-proxcanvas-shell *[style*="radial-gradient"][style*="#ffd"],
      kc-proxcanvas-shell *[style*="radial-gradient"][style*="#ffe"],
      kc-proxcanvas-shell *[style*="radial-gradient"][style*="yellow"],
      kc-proxcanvas-shell *[style*="radial-gradient"][style*="gold"] {
        background: #007acc !important;
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