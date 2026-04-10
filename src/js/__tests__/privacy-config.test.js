import { describe, it, expect } from 'vitest';
import {
    isNonProductionEnvironment,
    getPrivacyRequestConfig,
} from '../privacy-config.js';

describe('privacy-config', () => {
    it('detects non-production hosts from known patterns', () => {
        expect(isNonProductionEnvironment('mysite.staging.example.com')).toBe(true);
        expect(isNonProductionEnvironment('shop-dev.example.com')).toBe(true);
        expect(isNonProductionEnvironment('brand.lndo.site')).toBe(true);
    });

    it('detects non-production Vercel domains', () => {
        expect(isNonProductionEnvironment('project-pr-123.vercel.app')).toBe(true);
    });

    it('detects non-production from vercel env value', () => {
        expect(isNonProductionEnvironment('www.example.com', 'preview')).toBe(true);
        expect(isNonProductionEnvironment('www.example.com', 'development')).toBe(true);
    });

    it('does not mark normal production host as non-production', () => {
        expect(isNonProductionEnvironment('www.example.com')).toBe(false);
    });

    it('returns staging config when staging flag is enabled', () => {
        const config = getPrivacyRequestConfig({
            host: 'www.example.com',
            electroPrivacyStaging: true,
        });

        expect(config.url).toBe('https://privacyportaluat.onetrust.com/request/v1/consentreceipts');
        expect(config.environment).toBe('STAGING');
    });

    it('returns production config for production host without staging signal', () => {
        const config = getPrivacyRequestConfig({
            host: 'www.example.com',
            electroPrivacyStaging: false,
        });

        expect(config.url).toBe('https://privacyportal.onetrust.com/request/v1/consentreceipts');
        expect(config.environment).toBe('PRODUCTION');
    });
});
