const fs = require('fs');

const files = [
  'src/pages/index.astro',
  'src/pages/[region]/index.astro',
  'src/pages/location/[state].astro'
];

// The new block
const newBlock = `        if (slide.adType === 'google-search') {
          newHTML = \`
            <div style="background: var(--li-bg, rgba(15,23,42,0.8)); backdrop-filter: blur(12px); border: 1px solid var(--li-border, rgba(255,255,255,0.1)); border-radius: 8px; padding: 16px; text-align: left; width: 100%;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <div style="width: 28px; height: 28px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; font-size: 12px;">G</div>
                <div>
                  <div style="font-family: Arial, sans-serif; font-size: 14px; color: var(--li-text, #fff); font-weight: 500;">Gomza Real Estate</div>
                  <div style="font-family: Arial, sans-serif; font-size: 12px; color: var(--li-subtext, rgba(255,255,255,0.6));">Sponsored</div>
                </div>
              </div>
              <h3 style="font-family: Arial, sans-serif; font-size: 20px; color: #8ab4f8; margin: 8px 0; font-weight: 400;">\${slide.title}</h3>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: var(--li-subtext, rgba(255,255,255,0.8)); line-height: 1.5; margin: 0;">\${slide.desc}</p>
            </div>
          \`;
        } else if (slide.adType === 'google-call') {
          newHTML = \`
            <div style="background: var(--li-bg, rgba(15,23,42,0.8)); backdrop-filter: blur(12px); border: 1px solid var(--li-border, rgba(255,255,255,0.1)); border-radius: 8px; padding: 16px; text-align: left; width: 100%;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <div style="width: 28px; height: 28px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; font-size: 12px;">G</div>
                <div style="font-family: Arial, sans-serif; font-size: 14px; color: var(--li-text, #fff);">Gomza Real Estate</div>
              </div>
              <h3 style="font-family: Arial, sans-serif; font-size: 18px; color: #8ab4f8; margin: 0 0 8px 0; font-weight: 400;">\${slide.title}</h3>
              <p style="font-family: Arial, sans-serif; font-size: 14px; color: var(--li-subtext, rgba(255,255,255,0.8)); line-height: 1.5; margin: 0 0 16px 0;">\${slide.desc}</p>
              <div style="display: flex; align-items: center; gap: 8px; color: #8ab4f8; font-family: Arial, sans-serif; font-weight: bold;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                \${slide.btn}
              </div>
            </div>
          \`;
        } else if (slide.adType === 'youtube') {
          newHTML = \`
            <div style="background: var(--li-bg, rgba(15,23,42,0.8)); backdrop-filter: blur(12px); border-radius: 8px; overflow: hidden; width: 100%; border: 1px solid var(--li-border, rgba(255,255,255,0.1));">
              <div style="height: 180px; position: relative; background: transparent;">
                <div style="position: absolute; bottom: 8px; left: 8px; background: #fce138; color: #000; font-size: 12px; font-weight: bold; padding: 2px 6px; border-radius: 2px; font-family: Roboto, Arial, sans-serif;">Ad</div>
              </div>
              <div style="padding: 12px; display: flex; gap: 12px;">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: #fff; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #000; font-weight: bold;">G</div>
                <div style="text-align: left;">
                  <div style="color: var(--li-text, #fff); font-family: Roboto, Arial, sans-serif; font-size: 14px; font-weight: 500; margin-bottom: 4px; line-height: 1.4;">\${slide.title} | \${slide.badge}</div>
                  <div style="color: var(--li-subtext, #aaa); font-family: Roboto, Arial, sans-serif; font-size: 12px;">Gomza Real Estate</div>
                  <div style="color: var(--li-subtext, #aaa); font-family: Roboto, Arial, sans-serif; font-size: 12px;">\${slide.desc}</div>
                </div>
              </div>
            </div>
          \`;
        } else if (slide.adType === 'linkedin') {
           newHTML = \`
             <div style="background: var(--li-bg, rgba(15,23,42,0.8)); backdrop-filter: blur(12px); border: 1px solid var(--li-border, rgba(255,255,255,0.1)); border-radius: 8px; overflow: hidden; text-align: left; box-shadow: 0 8px 32px rgba(0,0,0,0.4); display: flex; flex-direction: column; width: 100%;">
               <div style="padding: 12px 16px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--li-border, rgba(255,255,255,0.1));">
                 <div style="width: 40px; height: 40px; background: #0a66c2; color: #fff; font-weight: bold; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 18px;">G</div>
                 <div>
                   <div style="font-family: -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: 600; color: var(--li-text, #fff);">Gomza Real Estate</div>
                   <div style="font-family: -apple-system, system-ui, sans-serif; font-size: 12px; color: var(--li-subtext, rgba(255,255,255,0.5));">Promoted</div>
                 </div>
               </div>
               <div style="padding: 12px 16px; font-family: -apple-system, system-ui, sans-serif; font-size: 14px; color: var(--li-text, rgba(255,255,255,0.9)); line-height: 1.5;">
                 \${slide.desc}
               </div>
               <div style="height: 120px; background: transparent;"></div>
               <div style="background: var(--li-card-bg, rgba(0,0,0,0.3)); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--li-border, rgba(255,255,255,0.1));">
                 <div>
                   <div style="font-family: -apple-system, system-ui, sans-serif; font-size: 12px; color: var(--li-subtext, rgba(255,255,255,0.6)); margin-bottom: 2px;">\${slide.badge}</div>
                   <div style="font-family: -apple-system, system-ui, sans-serif; font-size: 14px; font-weight: 600; color: var(--li-text, #fff);">\${slide.title}</div>
                 </div>
                 <button style="background: #0a66c2; color: #fff; border: none; padding: 6px 16px; border-radius: 24px; font-weight: 600; font-size: 14px; cursor: pointer;">\${slide.btn}</button>
               </div>
             </div>
            \`;
        } else if (slide.adType === 'fb') {
           newHTML = \`
             <div style="background: var(--fb-bg, #242526); border-radius: 12px; border: 1px solid var(--fb-border, #3e4042); overflow: hidden; text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
               <div style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                 <div style="display: flex; align-items: center; gap: 10px;">
                   <div style="width: 40px; height: 40px; border-radius: 50%; background: #1877f2; color: #fff; font-weight: bold; display: flex; align-items: center; justify-content: center; font-size: 18px;">G</div>
                   <div>
                     <div style="font-size: 15px; font-weight: 600; color: var(--fb-text, #e4e6eb);">Gomza Luxury Homes</div>
                     <div style="font-size: 13px; color: var(--fb-subtext, #b0b3b8); display: flex; align-items: center; gap: 4px;">Sponsored <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>
                   </div>
                 </div>
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--fb-subtext, #b0b3b8)"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
               </div>
               <div style="padding: 0 16px 12px; font-size: 15px; color: var(--fb-text, #e4e6eb); line-height: 1.5;">
                 \${slide.desc}
               </div>
               <div style="height: 200px; background: transparent; border-top: 1px solid var(--fb-border, #3e4042); border-bottom: 1px solid var(--fb-border, #3e4042);"></div>
               <div style="padding: 12px 16px; background: var(--fb-card-bg, var(--fb-bg, #242526)); display: flex; justify-content: space-between; align-items: center;">
                 <div>
                   <div style="font-size: 12px; color: var(--fb-subtext, #b0b3b8); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">gomza.com</div>
                   <div style="font-size: 16px; font-weight: 600; color: var(--fb-text, #e4e6eb);">\${slide.title}</div>
                 </div>
                 <button style="background: var(--fb-border, #3e4042); color: var(--fb-text, #fff); border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; font-size: 14px; cursor: pointer;">\${slide.btn}</button>
               </div>
               <div style="padding: 12px 16px; border-top: 1px solid var(--fb-border, #3e4042); color: var(--fb-subtext, #b0b3b8); font-size: 14px; display: flex; justify-content: space-between;">
                 <div style="display: flex; align-items: center; gap: 6px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg> Like</div>
                 <div style="display: flex; align-items: center; gap: 6px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> Comment</div>
                 <div style="display: flex; align-items: center; gap: 6px;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> Share</div>
               </div>
             </div>
            \`;
        } else if (slide.adType === 'ig-story') {
           newHTML = \`
             <div style="background: var(--ig-bg, #000); border-radius: 12px; border: 1px solid var(--ig-border, #262626); overflow: hidden; text-align: left; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
               <div style="padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                 <div style="display: flex; align-items: center; gap: 10px;">
                   <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); padding: 2px;">
                     <div style="width: 100%; height: 100%; background: var(--ig-bg, #000); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--ig-text, #fff); font-weight: bold; font-size: 16px; border: 2px solid var(--ig-bg, #000);">G</div>
                   </div>
                   <div style="font-size: 14px; font-weight: 600; color: var(--ig-text, #fff);">gomza_realty <svg width="12" height="12" viewBox="0 0 24 24" fill="#3897f0" style="margin-left: 2px; display: inline-block; vertical-align: middle;"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z"/></svg></div>
                 </div>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--ig-text, #fff)"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
               </div>
               <div style="height: 220px; background: transparent; position: relative; display: flex; align-items: flex-end;">
                 <div style="width: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); padding: 12px 16px; border-top: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 14px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                    \${slide.btn} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                 </div>
               </div>
               
               <div style="padding: 12px 16px; background: var(--ig-bg, #000);">
                 <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                   <div style="display: flex; gap: 16px;">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ig-text, #fff)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ig-text, #fff)" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ig-text, #fff)" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                   </div>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ig-text, #fff)" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                 </div>
                 <div style="color: var(--ig-text, #fff); font-size: 14px; font-weight: 600; margin-bottom: 6px;">8,492 likes</div>
                 <div style="color: var(--ig-text, #fff); font-size: 14px; line-height: 1.4;">
                   <span style="font-weight: 600; margin-right: 4px;">gomza_realty</span>\${slide.desc}
                 </div>
               </div>
             </div>
            \`;
        } else if (slide.adType === 'tiktok') {
            newHTML = \`
             <div style="position: relative; width: 100%; height: 400px; border-radius: 12px; overflow: hidden; background: var(--tiktok-bg, #000); display: flex; flex-direction: column; justify-content: flex-end; padding: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="position: absolute; right: 16px; bottom: 80px; display: flex; flex-direction: column; gap: 16px; align-items: center;">
                  <div style="width: 40px; height: 40px; background: var(--tiktok-text, #fff); border-radius: 50%; border: 2px solid var(--tiktok-text, #fff); display: flex; align-items: center; justify-content: center;"><span style="color: var(--tiktok-bg, #000); font-weight: bold; font-family: sans-serif;">G</span></div>
                  <div style="display: flex; flex-direction: column; align-items: center;"><svg width="30" height="30" viewBox="0 0 24 24" fill="var(--tiktok-text, white)"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span style="color: var(--tiktok-text, #fff); font-size: 12px; font-family: sans-serif; font-weight: bold;">12.4K</span></div>
                  <div style="display: flex; flex-direction: column; align-items: center;"><svg width="30" height="30" viewBox="0 0 24 24" fill="var(--tiktok-text, white)"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg><span style="color: var(--tiktok-text, #fff); font-size: 12px; font-family: sans-serif; font-weight: bold;">842</span></div>
                </div>
                <div style="max-width: 80%;">
                  <h3 style="color: var(--tiktok-text, #fff); font-family: -apple-system, sans-serif; font-size: 16px; margin: 0 0 4px 0; font-weight: 700;">@gomza_realty</h3>
                  <p style="color: var(--tiktok-text, #fff); font-family: -apple-system, sans-serif; font-size: 14px; margin: 0 0 12px 0; line-height: 1.4;">\${slide.desc} <span style="font-weight: bold;">#luxury #realestate</span></p>
                </div>
                <button style="width: 100%; background: var(--tiktok-btn-bg, rgba(255,255,255,0.2)); backdrop-filter: blur(5px); color: var(--tiktok-text, #fff); border: 1px solid var(--tiktok-btn-border, rgba(255,255,255,0.3)); padding: 12px; border-radius: 8px; font-weight: bold; font-family: -apple-system, sans-serif; font-size: 15px; cursor: pointer; text-align: center;">\${slide.btn}</button>
             </div>
            \`;
        } else if (slide.adType === 'x') {
            newHTML = \`
             <div style="background: var(--x-bg, #000); border-radius: 12px; border: 1px solid var(--x-border, #333); overflow: hidden; text-align: left; width: 100%; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
               <div style="display: flex; gap: 12px;">
                 <div style="width: 44px; height: 44px; border-radius: 50%; background: #1da1f2; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; flex-shrink: 0;">G</div>
                 <div style="flex-grow: 1;">
                   <div style="display: flex; align-items: center; justify-content: space-between;">
                     <div>
                       <span style="color: var(--x-text, #fff); font-weight: bold; font-size: 15px; margin-right: 4px;">Gomza Luxury Homes</span>
                       <span style="color: var(--x-subtext, #71767b); font-size: 15px;">@GomzaHomes · Ad</span>
                     </div>
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--x-subtext, #71767b)"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                   </div>
                   <div style="color: var(--x-text, #fff); font-size: 15px; line-height: 1.4; margin-top: 4px; margin-bottom: 12px;">
                     \${slide.desc}
                   </div>
                   <div style="border: 1px solid var(--x-border, #333); border-radius: 16px; overflow: hidden;">
                     <div style="height: 120px; background: transparent;"></div>
                     <div style="background: var(--x-link-bg, #16181c); padding: 12px; border-top: 1px solid var(--x-border, #333); display: flex; justify-content: space-between; align-items: center;">
                       <div>
                         <div style="color: var(--x-subtext, #71767b); font-size: 13px;">gomza.com</div>
                         <div style="color: var(--x-text, #fff); font-size: 15px; margin-top: 2px;">\${slide.title}</div>
                       </div>
                       <button style="background: var(--x-btn-bg, #eff3f4); color: var(--x-btn-text, #0f1419); border: none; padding: 6px 16px; border-radius: 999px; font-weight: bold; font-size: 14px; cursor: pointer;">\${slide.btn}</button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
            \`;
        }`;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // We need to replace the entire if-else block
  // from `if (slide.adType === 'google-search') {`
  // up to just before `else {`
  const startIndex = content.indexOf("if (slide.adType === 'google-search') {");
  if (startIndex === -1) {
    console.log('Could not find start in', file);
    return;
  }
  
  const endMarker = "        else {\n          // Default Social Media / Visual style";
  const endIndex = content.indexOf(endMarker);
  
  if (endIndex === -1) {
    console.log('Could not find end in', file);
    return;
  }
  
  const newContent = content.substring(0, startIndex) + newBlock + '\n' + content.substring(endIndex);
  fs.writeFileSync(file, newContent, 'utf8');
  console.log('Successfully patched', file);
});
