const { expect } = require('chai');
const { pruneConversation } = require('../utils/conversation-window');

describe('Conversation sliding window', () => {
  it('preserves system messages and the newest complete turns', () => {
    const messages = [
      { role: 'system', content: 'Always answer clearly.' },
      { role: 'user', content: 'old question' },
      { role: 'assistant', content: 'old answer' },
      { role: 'user', content: 'new question' },
      { role: 'assistant', content: 'new answer' },
    ];

    const result = pruneConversation(messages, { maxTurns: 1, maxTokens: 100 });

    expect(result).to.deep.equal([
      { role: 'system', content: 'Always answer clearly.' },
      { role: 'user', content: 'new question' },
      { role: 'assistant', content: 'new answer' },
    ]);
  });

  it('enforces the token bound at complete turn boundaries', () => {
    const messages = [
      { role: 'system', content: 'Rules' },
      { role: 'user', content: 'a'.repeat(20) },
      { role: 'assistant', content: 'b'.repeat(20) },
      { role: 'user', content: 'c'.repeat(20) },
      { role: 'assistant', content: 'd'.repeat(20) },
    ];

    const result = pruneConversation(messages, { maxTurns: 10, maxTokens: 15 });

    expect(result[0]).to.deep.equal({ role: 'system', content: 'Rules' });
    expect(result.slice(1)).to.deep.equal([
      { role: 'user', content: 'c'.repeat(20) },
      { role: 'assistant', content: 'd'.repeat(20) },
    ]);
  });

  it('drops an incomplete turn after pruning', () => {
    const messages = [
      { role: 'system', content: 'Rules' },
      { role: 'user', content: 'old question' },
      { role: 'assistant', content: 'old answer' },
      { role: 'user', content: 'latest question' },
    ];

    const result = pruneConversation(messages, { maxTurns: 10, maxTokens: 100 });

    expect(result).to.deep.equal([
      { role: 'system', content: 'Rules' },
      { role: 'user', content: 'old question' },
      { role: 'assistant', content: 'old answer' },
    ]);
  });
});
