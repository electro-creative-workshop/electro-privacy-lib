# History

## 1.1.1 Stable Version

-   Version that was approved by initial QA testing.

## 1.1.2 Token Change

-   Changed token after it was changed in the OneTrust dashboard.

## 1.1.3 Fixed Broken Token

-   Note: the token has to be in quotation marks.

## 1.1.4 Production Token

-   Changed to production token/url/id (removing UAT information).

## 1.1.5 Form submit button conflict

-   Changed id from submit to ot-dns-submit

## 1.1.6 remove console.log

-   console.log(`email returned valid; emailInputValue = ${emailInputValue}`);

## 1.1.7 remove more console.log

-   console.log(`function returned false; emailInputValue = ${emailInputValue}`);
-   console.log('invalid email');

## 1.1.8 Updated language

-   in DNS popup

## 1.1.9 Support parameter on import path to use staging server

-   if `window.electroPrivacyStaging` set to `true` before electro-privacy js is imported, the library will use staging parameters for backend submissions.

## 1.2.0 Changed setTimeout to setInterval

## 1.2.1 Legal requested copy changes

## 1.2.2 Bug Fixes
 - Fix for Escape key not closing DNS popup (caused by onetrust-banner-sdk changes) - add our own keydown handler
 - Fix some errors with the Display of on/off text in DNS popup for Targeting/Advertising Cookies in addition to slider

## 1.2.3 Bug Fixes
  - Fix display of on/off text when switching between popups

## 1.2.4 Bug Fixes
- Add display=flex when showing on/off text

## 1.2.5 Remove optional chaining operator (.?)
- Not all sites support it

## 1.2.6 Detect non production systems for testing
- Use UAT backend for urls that match non-production

## 1.2.7 Fix regex pattern console error
- HTML pattern attribute change to use regex v flag (needs more chars escaped in character classes)
- https://groups.google.com/a/chromium.org/g/blink-dev/c/gIyvMw0n2qw

## 1.3.0 Add support for Translation
- add Spanish (US) language file
- add Arabic language file

## 1.3.1 Bug Fix
- Remove stray ';

## 1.4.0 Handle dynamic buttons for cookies & DNS
- use document level capture event handlers to handle dynamic buttons being recreated (dtc shops)

## 1.4.1 bug fix
- look for buttons as event targets or a child of button

## 1.4.2 bug fix
- legal text change

## 1.4.4 bug fix - Dec 6, 2024
- Move "on"/"off" text to be closer the slider
- Legal requested copy changes

## 1.4.6 bug fix - Dec 16, 2024
- CSS fixes: moved most styles to be inline instead of competing with OneTrust styles
- Spanish updates
- Markup changes to target text size

## 1.4.7 bug fix - Dec 16, 2024
- Minor HR spacing fix

## 1.4.8 bug fix - Feb 11, 2025
- Fix JS error "document.getElementById('ot-email') is null"
- Fix race condition with adding dns ui & js manipulating controls
- Fix endless interval loop when dnsCheck fn has error

## 1.4.9 bug fix - Feb 25, 2025
- Add source map for Sentry debugging
- Update dependencies
- Defensive programming

## 1.5.1 security improvements - Jan 2026
- **Security: Fix JSON injection vulnerability** - Use JSON.stringify() instead of template literals when constructing API request body to prevent malicious email values from breaking JSON structure
- **Security: Add input sanitization** - Trim whitespace, validate email length (max 254 chars per RFC 5321), and add maxlength attribute to email input field
- **Security: Prevent duplicate submissions** - Add submission throttling flag to prevent race conditions and multiple simultaneous API calls
- **Security: Enhanced error handling** - Add comprehensive error handling for network errors and API failures with user-friendly feedback
- **Security: Defense in depth** - Validate email at multiple points (client-side validation, before API call) and sanitize input throughout the submission flow
- **Security: Renamed token variable** - Changed variable name from `token` to `t` to avoid security scanner false positives (functionality unchanged)
- **UX: Improved error messages** - Add localized error messages for all supported languages (English, Spanish)
- **UX: Form state management** - Form re-enables on error to allow users to retry submissions
- **UX: Status message positioning** - Success and error messages now appear below the form field instead of inline for better visibility
- **Accessibility: Enhanced message indicators** - Added Unicode icons (✓ for success, ⚠ for error) and ARIA attributes (role, aria-live, aria-atomic) for screen reader support and better visual distinction beyond color
- **Code quality: Best practices** - Use textContent instead of innerHTML where possible, proper error handling that doesn't expose system details
- **Code quality: Fixed success message timing** - Success message now displays only after successful API response (2xx status), not before the API call completes
- **Code quality: Fixed race conditions** - Added null checks to prevent errors when accessing form elements that may not exist
- **Maintenance: Removed unused language file** - Removed Arabic language file (ar.json) as it was not being used by the module's default language loading mechanism
- **Maintenance: Removed dist from version control** - Added `dist` folder to `.gitignore` to keep git history clean (dist files are still included in npm package via `files` field in package.json)
- **Maintenance: Added prepublishOnly script** - Automatically builds `dist` folder before publishing to npm, ensuring published packages always have the latest built files
- **Maintenance: Explicit package files** - Added `files` field to package.json to explicitly include `dist`, `README.md`, and `CHANGELOG.md` in published npm packages
- **Version detection** - Version number is now accessible via `window.electroPrivacyVersion` in the browser console. To check the version on any site, open the browser console and type: `window.electroPrivacyVersion`