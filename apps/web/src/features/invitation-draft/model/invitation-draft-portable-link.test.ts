import { describe, expect, it } from 'vitest';

import { createInitialInvitationDraft, type InvitationDraft } from './invitation-draft';
import {
  encodePortableInvitationDraft,
  parsePortableInvitationPayload,
  portableInvitationMaxEncodedLength,
  portableInvitationMaxPayloadBytes,
  portableInvitationPath,
  portableInvitationPayloadVersion,
} from './invitation-draft-portable-link';

const encodeBytesAsBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/gu, '-')
    .replace(/\//gu, '_')
    .replace(/=+$/u, '');

const encodeTextAsBase64Url = (value: string) =>
  encodeBytesAsBase64Url(new TextEncoder().encode(value));

const encodeValueAsBase64Url = (value: unknown) => encodeTextAsBase64Url(JSON.stringify(value));

const decodeBase64UrlAsText = (payload: string) => {
  const paddingLength = (4 - (payload.length % 4)) % 4;
  const base64Value = payload.replace(/-/gu, '+').replace(/_/gu, '/');
  const binaryValue = atob(`${base64Value}${'='.repeat(paddingLength)}`);
  const bytes = Uint8Array.from(binaryValue, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
};

const getEncodedPayload = (draft: InvitationDraft) => {
  const result = encodePortableInvitationDraft(draft);

  expect(result.status).toBe('encoded');

  if (result.status !== 'encoded') {
    throw new Error('Expected the invitation draft to be encoded');
  }

  return result.payload;
};

describe('invitation draft portable links', () => {
  it('defines a stable versioned and bounded portable contract', () => {
    expect(portableInvitationPayloadVersion).toBe(1);
    expect(portableInvitationPath).toBe('/invitation');
    expect(portableInvitationMaxPayloadBytes).toBe(4096);
    expect(portableInvitationMaxEncodedLength).toBe(
      Math.ceil((portableInvitationMaxPayloadBytes * 4) / 3),
    );
  });

  it('encodes only the supported fields in a versioned envelope', () => {
    const draft = createInitialInvitationDraft();
    const payload = getEncodedPayload(draft);
    const serializedEnvelope = decodeBase64UrlAsText(payload);

    expect(payload).toMatch(/^[A-Za-z0-9_-]+$/u);
    expect(payload).not.toMatch(/[+/=]/u);
    expect(JSON.parse(serializedEnvelope)).toEqual({
      version: portableInvitationPayloadVersion,
      draft,
    });
  });

  it('round-trips accents and Unicode characters from a URL fragment', () => {
    const draft: InvitationDraft = {
      eventTitle: 'Quince años de Sofía ✨',
      eventDate: '2027-04-24',
      location: 'Salón Jardín · Mérida, México',
      message: 'Celebremos juntos: música, alegría y corazón 💜',
      theme: 'champagne',
    };

    const payload = getEncodedPayload(draft);

    expect(parsePortableInvitationPayload(`#${payload}`)).toEqual({
      status: 'decoded',
      draft,
    });
  });

  it('returns an independent draft after decoding', () => {
    const draft = createInitialInvitationDraft();
    const payload = getEncodedPayload(draft);
    const result = parsePortableInvitationPayload(payload);

    expect(result.status).toBe('decoded');

    if (result.status !== 'decoded') {
      throw new Error('Expected the portable payload to be decoded');
    }

    expect(result.draft).toEqual(draft);
    expect(result.draft).not.toBe(draft);
  });

  it('refuses to encode a draft outside the supported schema', () => {
    const invalidDraft = {
      ...createInitialInvitationDraft(),
      theme: 'unknown',
    } as unknown as InvitationDraft;

    expect(encodePortableInvitationDraft(invalidDraft)).toEqual({
      status: 'invalid-draft',
      payload: null,
    });
  });

  it('reports an empty fragment without attempting to decode it', () => {
    expect(parsePortableInvitationPayload('')).toEqual({
      status: 'empty',
      draft: null,
    });

    expect(parsePortableInvitationPayload('#')).toEqual({
      status: 'empty',
      draft: null,
    });
  });

  it('rejects characters outside the Base64URL alphabet', () => {
    expect(parsePortableInvitationPayload('#not+base64')).toEqual({
      status: 'invalid',
      draft: null,
    });
  });

  it('rejects malformed UTF-8 bytes', () => {
    const payload = encodeBytesAsBase64Url(new Uint8Array([0xc3, 0x28]));

    expect(parsePortableInvitationPayload(payload)).toEqual({
      status: 'invalid',
      draft: null,
    });
  });

  it('rejects malformed JSON and unexpected envelope fields', () => {
    const malformedJsonPayload = encodeTextAsBase64Url('{');
    const unexpectedFieldsPayload = encodeValueAsBase64Url({
      version: portableInvitationPayloadVersion,
      draft: createInitialInvitationDraft(),
      unexpected: true,
    });

    expect(parsePortableInvitationPayload(malformedJsonPayload)).toEqual({
      status: 'invalid',
      draft: null,
    });

    expect(parsePortableInvitationPayload(unexpectedFieldsPayload)).toEqual({
      status: 'invalid',
      draft: null,
    });
  });

  it('reports an unsupported envelope version explicitly', () => {
    const payload = encodeValueAsBase64Url({
      version: portableInvitationPayloadVersion + 1,
      draft: createInitialInvitationDraft(),
    });

    expect(parsePortableInvitationPayload(payload)).toEqual({
      status: 'unsupported',
      draft: null,
    });
  });

  it('rejects an envelope containing an invalid invitation draft', () => {
    const payload = encodeValueAsBase64Url({
      version: portableInvitationPayloadVersion,
      draft: {
        ...createInitialInvitationDraft(),
        eventDate: '2027-02-30',
      },
    });

    expect(parsePortableInvitationPayload(payload)).toEqual({
      status: 'invalid',
      draft: null,
    });
  });

  it('rejects a payload exceeding the encoded size boundary', () => {
    const oversizedPayload = 'A'.repeat(portableInvitationMaxEncodedLength + 1);

    expect(parsePortableInvitationPayload(oversizedPayload)).toEqual({
      status: 'too-large',
      draft: null,
    });
  });
});
