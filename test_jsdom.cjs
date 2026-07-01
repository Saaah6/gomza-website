const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fs = require('fs');

const content = fs.readFileSync('src/pages/location/[state].astro', 'utf8');
const scriptMatches = content.match(/<script is:inline>([\s\S]*?)<\/script>/);

if (scriptMatches) {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <div id="ad-showcase-section"></div>
    <div id="street-lamp-toggle"></div>
    <div id="billboard-inner"></div>
    <div id="billboard-content-wrapper"></div>
    <div id="billboard-badge"></div>
    <div id="billboard-title"></div>
    <div id="billboard-desc"></div>
    <div id="billboard-price"></div>
    <div id="billboard-btn"></div>
  `, { runScripts: 'dangerously' });

  // Add error listener to catch runtime errors
  dom.window.addEventListener('error', (event) => {
    console.error('Runtime error:', event.error);
  });

  const script = dom.window.document.createElement('script');
  script.textContent = scriptMatches[1];
  dom.window.document.head.appendChild(script);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

  setTimeout(() => {
    console.log('Done waiting. No crash!');
  }, 5500);
}
