// / /////////////////////////////////////////////
//  Do Not Share script part two
// / /////////////////////////////////////////////
import {getLanguageString} from "./language-support";

// Define variables
let otDataSubjectId;
let dnsUI = false;
let isSubmitting = false; // Prevent duplicate submissions
const MAX_EMAIL_LENGTH = 254; // RFC 5321 maximum email length

// Collection Point Information
// SECURITY: Token must be provided via environment variable - no hardcoded tokens allowed
// Set window.ELECTRO_PRIVACY_TOKEN (production) or window.ELECTRO_PRIVACY_TOKEN_STAGING (staging)
// before importing this module. See README.md for setup instructions.

// Configuration variables - initialized lazily when modal opens
let url = null;
let t = null; // Token must be set via environment variable - no hardcoded fallback
let preferences = null;

// Token and configuration initialization function - called lazily when modal opens
// This allows the window variable to be set after module load, as long as it's set before the user opens the modal
function initializeToken() {
    // Only initialize once
    if (t !== null && url !== null && preferences !== null) {
        return t;
    }
    
    // Re-check staging status in case window.electroPrivacyStaging was set after module load
    const currentIsStaging = window.electroPrivacyStaging || isNonProduction();
    
    // Set URL and preferences based on staging status
    if (currentIsStaging) {
        url = ' https://privacyportaluat.onetrust.com/request/v1/consentreceipts';
        preferences = '"purposes": [{"Id": "9cb76b94-6766-4f51-8f4b-1f518acdd165","TransactionType": "WITHDRAWN"}]';
    } else {
        url = 'https://privacyportal.onetrust.com/request/v1/consentreceipts';
        preferences = '"purposes": [{"Id": "528de150-b5f3-467d-be11-757756601224","TransactionType": "WITHDRAWN"}]';
    }
    
    // Token must be provided via window.ELECTRO_PRIVACY_TOKEN or window.ELECTRO_PRIVACY_TOKEN_STAGING
    // This is REQUIRED - no fallback to hardcoded values for security reasons
    if (currentIsStaging) {
        if (typeof window !== 'undefined' && window.ELECTRO_PRIVACY_TOKEN_STAGING) {
            // Ensure token is wrapped in quotes if not already
            t = window.ELECTRO_PRIVACY_TOKEN_STAGING.startsWith('"') 
                ? window.ELECTRO_PRIVACY_TOKEN_STAGING 
                : `"${window.ELECTRO_PRIVACY_TOKEN_STAGING}"`;
        } else {
            console.error('electro-privacy: ELECTRO_PRIVACY_TOKEN_STAGING is required but not set. Please set window.ELECTRO_PRIVACY_TOKEN_STAGING before using this module.');
            t = null;
        }
    } else {
        if (typeof window !== 'undefined' && window.ELECTRO_PRIVACY_TOKEN) {
            // Ensure token is wrapped in quotes if not already
            t = window.ELECTRO_PRIVACY_TOKEN.startsWith('"') 
                ? window.ELECTRO_PRIVACY_TOKEN 
                : `"${window.ELECTRO_PRIVACY_TOKEN}"`;
        } else {
            console.error('electro-privacy: ELECTRO_PRIVACY_TOKEN is required but not set. Please set window.ELECTRO_PRIVACY_TOKEN before using this module.');
            t = null;
        }
    }
    
    return t;
}

// check url against known list of non-production environments
function isNonProduction()
{
    const testList = [
        'lndo.site',
        'pantheonsite',
        'staging',
        'qa',
        'dev',
        'local',
        'vercel.app', // Vercel preview and development deployments
    ];
    const serverName = location.host;
    
    // Check if hostname matches any non-production patterns
    if (testList.some(testString => serverName.includes(testString))) {
        // Special case: Only treat vercel.app as staging if it's NOT a production domain
        // Production Vercel deployments typically use custom domains, not vercel.app
        // Preview and development deployments use vercel.app subdomains
        if (serverName.includes('vercel.app')) {
            // If it's a vercel.app domain, it's likely a preview/dev deployment
            // Production sites on Vercel typically use custom domains
            return true;
        }
        return true;
    }
    
    // Also check for Vercel environment variable if available (set by Next.js)
    // This is more reliable than hostname checking
    if (typeof window !== 'undefined' && window.VERCEL_ENV) {
        // Vercel sets this to 'preview' or 'development' for non-production
        if (window.VERCEL_ENV === 'preview' || window.VERCEL_ENV === 'development') {
            return true;
        }
    }
    
    return false;
}

// Purpose Ids Assigned to Collection Point

// make POST call to hit collection point
function setPreferences(otDataSubjectId) {
    // Initialize token (lazy loading - checks when actually needed)
    initializeToken();
    
    // Validate token is set - required for security
    if (!t || t === null) {
        console.error('electro-privacy: Token is not configured. Please set window.ELECTRO_PRIVACY_TOKEN or window.ELECTRO_PRIVACY_TOKEN_STAGING before using this module.');
        showErrorMessage();
        isSubmitting = false;
        return;
    }

    // Sanitize email input - trim whitespace and ensure it's a string
    const sanitizedEmail = String(otDataSubjectId).trim();
    
    // Validate email again before sending (defense in depth)
    if (!sanitizedEmail || !validateEmail(sanitizedEmail)) {
        console.error('Invalid email format before API call');
        showErrorMessage();
        isSubmitting = false;
        return;
    }

    // Build the request body safely to prevent JSON injection attacks
    // Token and preferences are pre-formatted partial JSON strings that need to be concatenated
    // Use JSON.stringify only on the user-provided email to safely escape it
    // Token is stored as '"eyJ..."' (a quoted JSON string value)
    // Preferences is stored as '"purposes": [...]' (a partial JSON property)
    const body = `{"identifier":${JSON.stringify(sanitizedEmail)},"requestInformation":${t},${preferences}}`;
    
    // Validate the constructed JSON is valid before sending
    try {
        JSON.parse(body);
    } catch (e) {
        console.error('Error: Constructed JSON is invalid:', e);
        showErrorMessage();
        isSubmitting = false;
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // Add error handling
    xhr.onerror = function() {
        console.error('Network error occurred during API call');
        showErrorMessage();
        isSubmitting = false;
        // Re-enable form on error
        const textInput = document.getElementById('ot-email');
        const submitBtn = document.getElementById('ot-dns-submit');
        if (textInput) textInput.disabled = false;
        if (submitBtn) submitBtn.disabled = false;
    };
    
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Success - show success message
            const existingError = document.getElementById('ot-submit-error');
            const existingSuccess = document.getElementById('ot-submit-text');
            
            // Remove any existing messages
            if (existingError) existingError.remove();
            if (existingSuccess) existingSuccess.remove();
            
            // Show success message with icon and accessibility attributes
            const confirmSubmit = document.createElement('div');
            confirmSubmit.id = 'ot-submit-text';
            confirmSubmit.setAttribute('style', 'color: green; font-weight: bold;');
            confirmSubmit.setAttribute('role', 'status');
            confirmSubmit.setAttribute('aria-live', 'polite');
            confirmSubmit.setAttribute('aria-atomic', 'true');
            // Use checkmark icon (✓) for visual distinction beyond color
            confirmSubmit.textContent = `✓ ${getLanguageString('Successfully Submitted!')}`;
            
            const statusContainer = document.getElementById('ot-submit-status');
            if (statusContainer) {
                statusContainer.appendChild(confirmSubmit);
            }
        } else {
            console.error('API call failed with status:', xhr.status);
            showErrorMessage();
            isSubmitting = false;
            // Re-enable form on error
            const textInput = document.getElementById('ot-email');
            const submitBtn = document.getElementById('ot-dns-submit');
            if (textInput) textInput.disabled = false;
            if (submitBtn) submitBtn.disabled = false;
        }
    };
    
    xhr.send(body);
}

const re =
    /^(([^<>\(\)\[\]\\.,;:\s@"]+(\.[^<>\(\)\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// email format validation
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    // Trim and check length
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0 || trimmedEmail.length > MAX_EMAIL_LENGTH) {
        return false;
    }
    
    // Validate format with regex
    return re.test(trimmedEmail.toLowerCase());
}

// Show error message to user
function showErrorMessage() {
    const errorText = getLanguageString('An error occurred. Please try again.');
    const existingError = document.getElementById('ot-submit-error');
    const existingSuccess = document.getElementById('ot-submit-text');
    
    // Remove existing messages
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'ot-submit-error';
    errorDiv.setAttribute('style', 'color: red; font-weight: bold;');
    errorDiv.setAttribute('role', 'alert');
    errorDiv.setAttribute('aria-live', 'assertive');
    errorDiv.setAttribute('aria-atomic', 'true');
    // Use warning icon (⚠) for visual distinction beyond color
    errorDiv.textContent = `⚠ ${errorText}`;
    
    const statusContainer = document.getElementById('ot-submit-status');
    if (statusContainer) {
        statusContainer.appendChild(errorDiv);
    }
}

// if email input is valid, trigger submitPreferences function and disable text input field and submit button
function inputValidation() {
    // Prevent duplicate submissions
    if (isSubmitting) {
        return;
    }
    
    const textInput = document.getElementById('ot-email');
    const submitBtn = document.getElementById('ot-dns-submit');
    
    if (!textInput || !submitBtn) {
        return;
    }
    
    // Sanitize input - trim whitespace
    const emailValue = textInput.value.trim();
    
    // Validate email
    if (validateEmail(emailValue)) {
        // Set submitting flag
        isSubmitting = true;
        
        // Disable form to prevent duplicate submissions
        textInput.disabled = true;
        submitBtn.disabled = true;
        
        // Remove any existing messages
        const existingError = document.getElementById('ot-submit-error');
        const existingSuccess = document.getElementById('ot-submit-text');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        // Submit with sanitized email
        // Success message will be shown after API call succeeds
        submitPreferences();
    } else {
        // Show validation error
        const existingError = document.getElementById('ot-submit-error');
        const existingSuccess = document.getElementById('ot-submit-text');
        
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        const errorDiv = document.createElement('div');
        errorDiv.id = 'ot-submit-error';
        errorDiv.setAttribute('style', 'color: red; font-weight: bold;');
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'assertive');
        errorDiv.setAttribute('aria-atomic', 'true');
        // Use warning icon (⚠) for visual distinction beyond color
        errorDiv.textContent = `⚠ ${getLanguageString('Please enter a valid email.')}`;
        
        const statusContainer = document.getElementById('ot-submit-status');
        if (statusContainer) {
            statusContainer.appendChild(errorDiv);
        }
    }
}

// grab email input value and trigger API POST
function submitPreferences() {
    // grab value from email form field
    // Value is Data Subject ID
    const textInput = document.getElementById('ot-email');

    if (!textInput || textInput.value === '') {
        console.error('Identifier Not Set');
        isSubmitting = false;
        // Re-enable form if elements exist
        if (textInput) textInput.disabled = false;
        const submitBtn = document.getElementById('ot-dns-submit');
        if (submitBtn) submitBtn.disabled = false;
        return;
    }
    
    // Sanitize and validate email before sending
    const emailValue = textInput.value.trim();
    if (!validateEmail(emailValue)) {
        console.error('Invalid email format in submitPreferences');
        isSubmitting = false;
        // Re-enable form if elements exist
        if (textInput) textInput.disabled = false;
        const submitBtn = document.getElementById('ot-dns-submit');
        if (submitBtn) submitBtn.disabled = false;
        return;
    }
    
    // else if(OnetrustActiveGroups === ",," && saveButtonClicked === false){
    //    console.warn("New Preferences Set")
    //    setTimeout(setPreferences,100);
    // }
    // Use sanitized email value
    setTimeout(() => setPreferences(emailValue), 100);
}

// when clicking on "Do Not Share" footer link:
// - hide cookie categories BESIDES targeting
// - show email input DIV
// - simulate click on Targeting to toggle off (may be removed depending on Clorox decision about UX)
function doNotShareUI() {
    // Initialize token and configuration when modal opens (lazy loading)
    // This allows window variables to be set after module load
    initializeToken();
    
    // let stockText = document.getElementById("stock-text");
    const stockText = document.getElementById('ot-pc-desc');
    const dnsText = document.getElementById('dns-custom-text');
    const essentialCat = document.querySelectorAll(
        "div.ot-cat-item.ot-always-active-group[data-optanongroupid='C0001']"
    )[0];
    const performanceCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0002']")[0];
    const functionalCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0003']")[0];
    const closeBtn = document.getElementById('close-pc-btn-handler');
    const paidMarketingText = document.getElementById('ot-email-text');
    const emailInput = document.getElementById('ot-email-submit');
    const pcCatTitle = document.getElementById('ot-category-title');
    const catDescription = document.getElementById('ot-desc-id-C0004');
    const pcTitle = document.getElementById('ot-pc-title');
    const trackingCat = document.querySelectorAll('#ot-group-id-C0004')[0];
    const checkboxStatus = document.getElementById('ot-checkbox-status');

    // Make sure all referenced elements were found
    if (!stockText || !dnsText || !essentialCat || !performanceCat || !functionalCat || 
        !closeBtn || !paidMarketingText || !emailInput || !pcCatTitle || !catDescription || 
        !pcTitle || !checkboxStatus || !trackingCat
    ) {
        console.error('doNotShareUI: One or more elements not found');
        return;
    }

    pcTitle.textContent = getLanguageString('Privacy Choices');

    stockText.style.display = 'none';
    dnsText.style.display = 'block';
    paidMarketingText.style.display = 'block';
    emailInput.style.display = 'block';
    essentialCat.style.display = 'none';
    performanceCat.style.display = 'none';
    functionalCat.style.display = 'none';
    closeBtn.style.display = 'none';
    pcCatTitle.style.display = 'none';
    catDescription.style.display = 'none';

    // make sure On/Off text is displayed properly
    trackingCat.dispatchEvent(new Event('change'))
    checkboxStatus.style.display = 'position: relative; top: -5px; display: inline-block; margin-left: 5px;';

    // Ensure email input and submit button are enabled when modal opens
    const emailField = document.getElementById('ot-email');
    const submitBtn = document.getElementById('ot-dns-submit');
    if (emailField) {
        emailField.disabled = false;
    }
    if (submitBtn) {
        submitBtn.disabled = false;
    }
    
    // Clear any existing status messages
    const existingError = document.getElementById('ot-submit-error');
    const existingSuccess = document.getElementById('ot-submit-text');
    if (existingError) existingError.remove();
    if (existingSuccess) existingSuccess.remove();

    dnsUI = true;
}

// reverse everything from doNotShareUI function once clicking of CTA
function hideDnsUI() {
    if (dnsUI) {
        // let stockText = document.getElementById("stock-text");
        const stockText = document.getElementById('ot-pc-desc');
        const dnsText = document.getElementById('dns-custom-text');
        const essentialCat = document.querySelectorAll(
            "div.ot-cat-item.ot-always-active-group[data-optanongroupid='C0001']"
        )[0];
        const performanceCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0002']")[0];
        const functionalCat = document.querySelectorAll("div.ot-cat-item[data-optanongroupid='C0003']")[0];
        const closeBtn = document.getElementById('close-pc-btn-handler');
        const paidMarketingText = document.getElementById('ot-email-text');
        const emailInput = document.getElementById('ot-email-submit');
        const pcCatTitle = document.getElementById('ot-category-title');
        const catDescription = document.getElementById('ot-desc-id-C0004');
        const pcTitle = document.getElementById('ot-pc-title');
        const toggleTextContainer = document.getElementById('ot-checkbox-status');

        // Make sure all referenced elements were found
        if (!stockText || !dnsText || !essentialCat || !performanceCat || !functionalCat || 
            !closeBtn || !paidMarketingText || !emailInput || !pcCatTitle || !catDescription || 
            !pcTitle || !toggleTextContainer
        ) {
            console.error('hideDnsUI: One or more elements not found');
            return;
        }

        toggleTextContainer.style.display = 'none';

        pcTitle.style.textAlign = 'center';
        stockText.style.display = 'block';
        dnsText.style.display = 'none';
        paidMarketingText.style.display = 'none';
        emailInput.style.display = 'none';
        essentialCat.style.display = 'block';
        performanceCat.style.display = 'block';
        functionalCat.style.display = 'block';
        closeBtn.style.display = 'block';
        pcCatTitle.style.display = 'block';
        catDescription.style.display = 'block';
        
        // Clear email input and status messages when modal closes
        const emailField = document.getElementById('ot-email');
        if (emailField) {
            emailField.value = '';
            emailField.disabled = false;
        }
        const submitBtn = document.getElementById('ot-dns-submit');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
        const existingError = document.getElementById('ot-submit-error');
        const existingSuccess = document.getElementById('ot-submit-text');
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
    }

    dnsUI = false;
}

// adding click event listeners to email submit button in DNS UI and CTAs
let domCheckInterval = setInterval(dnsCheck, 100);
function dnsCheck() {
    try {
        // verify UI has been added to document
        if (document.getElementById('do-not-share') && document.getElementById('ot-email') && document.getElementById('ot-dns-submit')) {
            // add pattern to email input
            document.getElementById('ot-email').pattern = re;
            document.getElementById('ot-email').setCustomValidity(getLanguageString('Please enter a valid email.'));

            document.getElementById('ot-dns-submit').addEventListener('click', inputValidation);

            // add handling for buttons being recreated (dtc shop)
            document.addEventListener('click', function (e) {
                const sdkButton = document.getElementById('ot-sdk-btn');
                const dnsButton = document.getElementById('do-not-share');
                if (e.target && e.target.id === 'ot-sdk-btn' || sdkButton && sdkButton.contains(e.target)) {
                    hideDnsUI();
                } else if (e.target && e.target.id === 'do-not-share' || dnsButton && dnsButton.contains(e.target)) {
                    doNotShareUI();
                }
            }, {
                capture: true
            })

            /*
            document.getElementById('do-not-share').addEventListener('click', doNotShareUI);
            document.getElementById('ot-sdk-btn').addEventListener('click', hideDnsUI);
             */

            // ot banner link
            if (document.getElementById('onetrust-pc-btn-handler')) {
                document.getElementById('onetrust-pc-btn-handler').addEventListener('click', hideDnsUI);
            }

            // ESC key handling to close
            //  Needed with onetrust-banner-sdk changes in
            //  v202304.1.0 - which can remove keyboard handler when cookies popup closes
            document.addEventListener('keydown', function (e) {
                if ('Escape' === e.code) {
                    // Clear email input and status messages before closing
                    const emailInput = document.getElementById('ot-email');
                    if (emailInput) {
                        emailInput.value = '';
                    }
                    const existingError = document.getElementById('ot-submit-error');
                    const existingSuccess = document.getElementById('ot-submit-text');
                    if (existingError) existingError.remove();
                    if (existingSuccess) existingSuccess.remove();
                    
                    // click dialog close button
                    const close = document.getElementById('close-pc-btn-handler');
                    if (close) {
                        close.click();
                    }
                }
            });

            // listen for styled checkbox state
            document.querySelectorAll('#ot-group-id-C0004')[0].addEventListener('change', function () {
                document.getElementById('ot-checkbox-status').textContent = this.checked ? getLanguageString('On') : getLanguageString('Off');
            });

            clearInterval(domCheckInterval);
            domCheckInterval = null;
        }
    } catch (error) {
        console.error("failure to init electro-privacy", error);
        clearInterval(domCheckInterval);
        domCheckInterval = null;
    }
}
