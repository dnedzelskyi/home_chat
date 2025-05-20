async function getSettings() {
  const res = await fetch('/api/settings');
  return await res.json();
}

async function getMessages(limit, after, before) {
  const params = new URLSearchParams();

  limit && params.append('limit', limit);
  after && params.append('after', after.toISOString());
  before && params.append('before', before.toISOString());

  const res = await fetch(`/api/messages?${params}`);
  return await res.json();
}

export default { getSettings, getMessages };
