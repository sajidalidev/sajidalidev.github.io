(() => {
  const ttl = 60 * 60 * 1000;
  const format = new Intl.NumberFormat('en');
  const valid = data => data && Number.isSafeInteger(data.count) && data.count >= 0 && Number.isFinite(data.updated);
  async function update(repo, links) {
    const key = `portfolio:github-stars:v1:${repo}`;
    let cached;
    try { cached = JSON.parse(localStorage.getItem(key)); } catch { /* Storage can be disabled. */ }
    const render = (data, stale = false) => links.forEach(link => {
      link.querySelector('[data-star-count]').textContent = `${format.format(data.count)} ${data.count === 1 ? 'star' : 'stars'}`;
      link.title = `${stale ? 'Last known count' : 'GitHub stars'} · Updated ${new Date(data.updated).toLocaleString()}`;
      link.setAttribute('aria-label', `${repo}: ${data.count} GitHub stars${stale ? ', last known count' : ''}`);
    });
    if (valid(cached)) {
      render(cached, Date.now() - cached.updated >= ttl);
      if (Date.now() - cached.updated >= 0 && Date.now() - cached.updated < ttl) return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, { headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal });
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const json = await response.json();
      const data = { count: json.stargazers_count, updated: Date.now() };
      if (!valid(data)) throw new Error('Invalid star count');
      render(data);
      try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* Counts still work without storage. */ }
    } catch {
      if (valid(cached)) render(cached, true);
      else links.forEach(link => { link.querySelector('[data-star-count]').textContent = 'View stars'; link.title = 'Star count unavailable. View stargazers on GitHub.'; });
    } finally { clearTimeout(timeout); }
  }
  const repos = new Map();
  document.querySelectorAll('[data-repo]').forEach(link => {
    const repo = link.dataset.repo;
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return;
    if (!repos.has(repo)) repos.set(repo, []);
    repos.get(repo).push(link);
  });
  repos.forEach((links, repo) => update(repo, links));
})();
