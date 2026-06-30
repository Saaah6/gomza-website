# SEO, AEO & GEO Optimization Plan

To get the website to appear in Google's **"People Also Ask"** sections and improve its visibility for AI Overviews (Generative Engine Optimization), we need to clearly structure data so search engine bots and AI engines can easily read, understand, and extract answers.

## Proposed Changes

### 1. Add Structured Data (JSON-LD)
Search engines use JSON-LD to understand the exact context of your site without having to parse HTML.
- **Organization Schema:** Tells Google exactly who "Gomza" is, your logo, URL, and contact info, establishing authority.
- **FAQPage Schema:** This is the *most critical* element for the "People Also Ask" section. We will inject a schema directly mapping out 4-5 common questions and answers about your agency.

#### [MODIFY] `src/layouts/Layout.astro`
- Inject the JSON-LD script blocks into the `<head>` tag.

### 2. Add an On-Page FAQ Section
Google requires that the questions in the FAQ schema are actually visible to users on the page. I will add a premium, beautifully styled FAQ accordion section.

#### [MODIFY] `src/pages/index.astro`
- Add a new "Frequently Asked Questions" section just before the footer or call-to-action area.
- Include questions like:
  - *What services does Gomza offer for Real Estate and SaaS?*
  - *How does Gomza improve conversion rates?*
  - *Do you work with B2B SaaS companies?*
  - *How can I book a strategy call with Gomza?*

#### [MODIFY] `src/styles/global.css`
- Add modern, animated styling for the FAQ accordions (using `<details>` and `<summary>`) to ensure it looks premium in both light and dark mode.

## User Review Required
> [!IMPORTANT]
> Please review the proposed FAQ questions above. If there are specific questions your clients ask you frequently, let me know so I can include them instead! Otherwise, I will use these highly-searched, SEO-optimized placeholders. Click **Proceed** if you approve.
