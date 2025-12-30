Reviewing the codebase to tailor a code review prompt.


[4 tools called]


Checking a few more files to understand the structure:


[3 tools called]


Here’s a code review prompt for your portfolio site:

---

## Code Review Prompt for Production Deployment

**Context:** I'm deploying my personal portfolio site to production. It's a Next.js 14 application built with TypeScript, React, and Tailwind CSS. Please review the codebase with a focus on production readiness.

**Please review the following areas:**

1. **Security & Privacy**
   - Check for exposed sensitive data (API keys, personal info, etc.)
   - Verify external links and user inputs are safe
   - Review metadata and ensure no unintended data leakage
   - Check for proper sanitization of user-generated content (if any)

2. **Performance & Optimization**
   - Image optimization (Next.js Image component usage, lazy loading)
   - Video loading strategies and performance impact
   - Bundle size and code splitting opportunities
   - Font loading optimization
   - Unused dependencies or dead code

3. **Accessibility (a11y)**
   - Semantic HTML structure
   - ARIA labels and roles where needed
   - Keyboard navigation support
   - Color contrast ratios
   - Screen reader compatibility
   - Focus management

4. **SEO & Metadata**
   - Complete and accurate metadata (OpenGraph, Twitter cards)
   - Structured data (JSON-LD) if applicable
   - Sitemap and robots.txt configuration
   - URL structure and canonical tags

5. **Error Handling & Edge Cases**
   - Missing image/video fallbacks
   - Broken link handling
   - Network error handling
   - 404 pages and error boundaries
   - Type safety and runtime validation

6. **Code Quality**
   - TypeScript strictness and type safety
   - Component reusability and maintainability
   - Consistent code style and patterns
   - Proper separation of concerns
   - Comment quality and documentation

7. **Production Configuration**
   - Next.js config optimization (compression, caching headers)
   - Environment variable handling
   - Build output analysis
   - Analytics/tracking implementation (if applicable)

8. **Browser Compatibility & Responsive Design**
   - Cross-browser testing considerations
   - Mobile responsiveness
   - Dark mode implementation
   - Viewport and responsive breakpoints

9. **Specific Concerns**
   - Video autoplay and performance impact
   - Large media file handling
   - Animation performance (framer-motion usage)
   - Third-party script loading

**Priority:** Focus on critical issues that could affect user experience, security, or site performance in production. Flag any "nice-to-have" improvements separately.

**Output Format:** Please categorize findings as:
- 🔴 Critical (must fix before production)
- 🟡 Important (should fix soon)
- 🟢 Nice-to-have (can address later)

---

This prompt covers the main areas for a production portfolio site. Should I adjust it for specific concerns or add any areas?