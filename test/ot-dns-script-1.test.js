import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('../src/js/privacy-config.js', () => ({
    getRuntimePrivacyRequestConfig: () => ({
        url: 'https://privacy.example.test/consent',
        token: '"test-token"',
        preferences: '"purposes": []',
        environment: 'staging',
    }),
}));

describe('privacy email form initialization', () => {
    let requests;

    beforeEach(async () => {
        vi.resetModules();
        vi.useFakeTimers();
        requests = [];
        vi.stubGlobal(
            'XMLHttpRequest',
            class {
                constructor() {
                    this.open = vi.fn();
                    this.setRequestHeader = vi.fn();
                    this.send = vi.fn();
                    requests.push(this);
                }
            }
        );
        document.documentElement.lang = 'en-US';
        document.body.innerHTML = `
            <button id="do-not-share">Your Privacy Choices</button>
            <div id="ot-pc-desc"></div>
            <div class="ot-sdk-row ot-cat-grp"></div>
            <div data-optanongroupid="C0004">
                <div class="ot-tgl"><input type="checkbox" id="ot-group-id-C0004"></div>
            </div>
        `;

        await import('../src/js/ot-dns-script-1.js');
        await vi.advanceTimersByTimeAsync(100);
        await vi.dynamicImportSettled();
        await vi.advanceTimersByTimeAsync(100);
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
        vi.unstubAllGlobals();
        document.body.innerHTML = '';
    });

    test('cancels form submission without an inline event handler', () => {
        const form = document.getElementById('ot-email-submit');
        const event = new Event('submit', { bubbles: true, cancelable: true });

        expect(form).not.toBeNull();
        expect(form.hasAttribute('onsubmit')).toBe(false);
        expect(form.dispatchEvent(event)).toBe(false);
        expect(event.defaultPrevented).toBe(true);
        expect(requests).toHaveLength(0);
    });

    test('keeps the existing validated submission and duplicate-request protection', () => {
        const email = document.getElementById('ot-email');
        const button = document.getElementById('ot-dns-submit');
        email.value = '  test@example.com  ';

        button.click();
        button.click();

        expect(requests).toHaveLength(1);
        expect(requests[0].open).toHaveBeenCalledWith('POST', 'https://privacy.example.test/consent');
        expect(JSON.parse(requests[0].send.mock.calls[0][0])).toEqual({
            identifier: 'test@example.com',
            requestInformation: 'test-token',
            purposes: [],
        });
        expect(email.disabled).toBe(true);
        expect(button.disabled).toBe(true);

        requests[0].status = 200;
        requests[0].onload();

        expect(email.disabled).toBe(false);
        expect(button.disabled).toBe(false);
        expect(document.getElementById('ot-submit-text').getAttribute('role')).toBe('status');
    });

    test('keeps invalid email handling local without submitting a request', () => {
        const email = document.getElementById('ot-email');
        email.value = 'not-an-email';

        document.getElementById('ot-dns-submit').click();

        expect(requests).toHaveLength(0);
        expect(email.value).toBe('');
        expect(document.getElementById('ot-submit-error').getAttribute('role')).toBe('alert');
    });
});
