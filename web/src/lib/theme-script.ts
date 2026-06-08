/**
 * Inline, render-blocking no-flash script. Resolves the theme class on <html>
 * before first paint from localStorage('mt-theme') or the OS preference.
 * Themes: light | dark | sensor (-> .light / .dark / .sensor-view).
 */
export const themeScript = `(function(){try{var t=localStorage.getItem('mt-theme');var c=document.documentElement.classList;c.remove('light','dark','sensor-view');if(t==='dark'){c.add('dark');}else if(t==='sensor'){c.add('sensor-view');}else if(t==='light'){c.add('light');}else{c.add(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');}}catch(e){}})();`;
