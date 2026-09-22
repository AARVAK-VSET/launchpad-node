const DEFAULT_MAX_TURNS = 20;
const DEFAULT_MAX_TOKENS = 4000;

function messageText(message) {
  if (typeof message.content === 'string') return message.content;
  return JSON.stringify(message.content || '');
}

function estimateTokens(message) {
  return Math.max(1, Math.ceil(messageText(message).length / 4));
}

function groupTurns(messages) {
  const turns = [];
  let currentTurn = [];

  messages.forEach((message) => {
    if (message.role === 'user' && currentTurn.length > 0) {
      turns.push(currentTurn);
      currentTurn = [];
    }
    currentTurn.push(message);
  });

  if (currentTurn.length > 0) turns.push(currentTurn);
  return turns;
}

function pruneConversation(messages, options = {}) {
  const { maxTurns = DEFAULT_MAX_TURNS, maxTokens = DEFAULT_MAX_TOKENS, allowIncompleteTurn = false } = options;
  const systemMessages = messages.filter((message) => message.role === 'system');
  const conversationMessages = messages.filter((message) => message.role !== 'system');
  const turns = groupTurns(conversationMessages);
  if (!allowIncompleteTurn && turns.length > 0 && turns[turns.length - 1].every((message) => message.role !== 'assistant')) {
    turns.pop();
  }
  const selectedTurns = [];
  let tokenCount = systemMessages.reduce((total, message) => total + estimateTokens(message), 0);

  for (let index = turns.length - 1; index >= 0 && selectedTurns.length < maxTurns; index -= 1) {
    const turn = turns[index];
    const turnTokens = turn.reduce((total, message) => total + estimateTokens(message), 0);
    if (tokenCount + turnTokens > maxTokens) break;
    selectedTurns.unshift(turn);
    tokenCount += turnTokens;
  }

  return [...systemMessages, ...selectedTurns.flat()];
}

module.exports = {
  DEFAULT_MAX_TOKENS,
  DEFAULT_MAX_TURNS,
  estimateTokens,
  pruneConversation,
};
