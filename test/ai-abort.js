/**
 * test/ai-abort.js
 *
 * Unit tests for Issue #20: Abort AI completion token streams on client disconnect.
 *
 * Strategy: stub `fetch` globally so we can:
 *   1. Confirm that requests carry a valid AbortSignal.
 *   2. Confirm that emitting 'close' on the Express `req` object aborts the signal
 *      before the upstream call resolves, causing the outstanding Promise to reject
 *      with an AbortError, and that the handler exits cleanly without writing to
 *      the already-closed response.
 */

'use strict';

const assert = require('assert');
const EventEmitter = require('events');

// ---------------------------------------------------------------------------
// Minimal Express-like mock helpers
// ---------------------------------------------------------------------------

function makeReq(body, file) {
  const emitter = new EventEmitter();
  emitter.body = body || {};
  emitter.file = file || null;
  emitter.flash = () => {};
  emitter.session = { aiConversations: {} };
  return emitter;
}

function makeRes() {
  return {
    headersSent: false,
    _status: 200,
    _body: null,
    status(code) { this._status = code; return this; },
    json(body) { this._body = body; this.headersSent = true; },
    render(view, data) { this._body = { view, data }; this.headersSent = true; },
    redirect(url) { this._body = { redirect: url }; this.headersSent = true; },
  };
}

function makeAbortError() {
  const err = new Error('The operation was aborted.');
  err.name = 'AbortError';
  return err;
}

// ---------------------------------------------------------------------------
// postTogetherAICamera
// ---------------------------------------------------------------------------

describe('postTogetherAICamera – AbortController on client disconnect', () => {
  let originalFetch;
  let capturedSignal;

  before(() => { originalFetch = global.fetch; });
  after(() => { global.fetch = originalFetch; });

  it('passes an AbortSignal to fetch', async () => {
    global.fetch = async (url, opts) => {
      capturedSignal = opts && opts.signal;
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'analysis' } }] }),
      };
    };

    process.env.TOGETHERAI_API_KEY = 'test-key';
    process.env.TOGETHERAI_VISION_MODEL = 'test-model';

    delete require.cache[require.resolve('../controllers/ai')];
    const { postTogetherAICamera } = require('../controllers/ai');

    const req = makeReq({}, { mimetype: 'image/png', buffer: Buffer.from('x'), originalname: 'test.png' });
    const res = makeRes();

    await postTogetherAICamera(req, res);

    assert.ok(capturedSignal instanceof AbortSignal, 'fetch should receive an AbortSignal');
  });

  it('silently exits when client disconnects before fetch resolves', async () => {
    global.fetch = async (url, opts) => {
      return new Promise((_resolve, reject) => {
        if (opts && opts.signal) {
          opts.signal.addEventListener('abort', () => reject(makeAbortError()));
        }
      });
    };

    process.env.TOGETHERAI_API_KEY = 'test-key';
    process.env.TOGETHERAI_VISION_MODEL = 'test-model';

    delete require.cache[require.resolve('../controllers/ai')];
    const { postTogetherAICamera } = require('../controllers/ai');

    const req = makeReq({}, { mimetype: 'image/png', buffer: Buffer.from('x'), originalname: 'test.png' });
    const res = makeRes();

    const handlerPromise = postTogetherAICamera(req, res);
    req.emit('close');
    await handlerPromise;

    assert.strictEqual(res.headersSent, false, 'response must not be written after client disconnect');
  });
});

// ---------------------------------------------------------------------------
// postTogetherAIClassifier
// ---------------------------------------------------------------------------

describe('postTogetherAIClassifier – AbortController on client disconnect', () => {
  let originalFetch;
  let capturedSignal;

  before(() => { originalFetch = global.fetch; });
  after(() => { global.fetch = originalFetch; });

  it('passes an AbortSignal to fetch', async () => {
    global.fetch = async (url, opts) => {
      capturedSignal = opts && opts.signal;
      return {
        ok: true,
        json: async () => ({ choices: [{ message: { content: '{"department":"Support"}' } }] }),
      };
    };

    process.env.TOGETHERAI_API_KEY = 'test-key';
    process.env.TOGETHERAI_MODEL = 'test-model';

    delete require.cache[require.resolve('../controllers/ai')];
    const { postTogetherAIClassifier } = require('../controllers/ai');

    const req = makeReq({ inputText: 'billing issue' });
    const res = makeRes();

    await postTogetherAIClassifier(req, res);

    assert.ok(capturedSignal instanceof AbortSignal, 'fetch should receive an AbortSignal');
  });

  it('silently exits when client disconnects before fetch resolves', async () => {
    global.fetch = async (url, opts) => {
      return new Promise((_resolve, reject) => {
        if (opts && opts.signal) {
          opts.signal.addEventListener('abort', () => reject(makeAbortError()));
        }
      });
    };

    process.env.TOGETHERAI_API_KEY = 'test-key';
    process.env.TOGETHERAI_MODEL = 'test-model';

    delete require.cache[require.resolve('../controllers/ai')];
    const { postTogetherAIClassifier } = require('../controllers/ai');

    const req = makeReq({ inputText: 'billing issue' });
    const res = makeRes();

    const handlerPromise = postTogetherAIClassifier(req, res);
    req.emit('close');
    await handlerPromise;

    assert.strictEqual(res.headersSent, false, 'response must not be written after client disconnect');
  });
});

// ---------------------------------------------------------------------------
// postOpenAIModeration
// ---------------------------------------------------------------------------

describe('postOpenAIModeration – AbortController on client disconnect', () => {
  let originalFetch;
  let capturedSignal;

  before(() => { originalFetch = global.fetch; });
  after(() => { global.fetch = originalFetch; });

  it('passes an AbortSignal to fetch', async () => {
    global.fetch = async (url, opts) => {
      capturedSignal = opts && opts.signal;
      return {
        ok: true,
        json: async () => ({ results: [{ flagged: false }] }),
      };
    };

    process.env.OPENAI_API_KEY = 'test-openai-key';

    delete require.cache[require.resolve('../controllers/ai')];
    const { postOpenAIModeration } = require('../controllers/ai');

    const req = makeReq({ inputText: 'Hello world' });
    const res = makeRes();

    await postOpenAIModeration(req, res);

    assert.ok(capturedSignal instanceof AbortSignal, 'fetch should receive an AbortSignal');
  });

  it('silently exits when client disconnects before fetch resolves', async () => {
    global.fetch = async (url, opts) => {
      return new Promise((_resolve, reject) => {
        if (opts && opts.signal) {
          opts.signal.addEventListener('abort', () => reject(makeAbortError()));
        }
      });
    };

    process.env.OPENAI_API_KEY = 'test-openai-key';

    delete require.cache[require.resolve('../controllers/ai')];
    const { postOpenAIModeration } = require('../controllers/ai');

    const req = makeReq({ inputText: 'Hello world' });
    const res = makeRes();

    const handlerPromise = postOpenAIModeration(req, res);
    req.emit('close');
    await handlerPromise;

    assert.strictEqual(res.headersSent, false, 'response must not be written after client disconnect');
  });
});
