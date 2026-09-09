# Sajid Ali portfolio

Static portfolio served by GitHub Pages. No build step is required.

## Local preview

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766. The Pehra support page is at `/pehra/`.

## GitHub stars

`assets/github-stars.js` reads each project link's `data-repo="owner/repository"` and fetches `stargazers_count` from GitHub's public repository API. No token or server is needed. Counts are cached in the visitor's browser for one hour and refreshed on a later page load when the cache expires. Duplicate repository links share one request.

If GitHub is unreachable or rate limited, the last known count remains with an explanatory tooltip. Without a cached count, the link says “View stars” and still opens GitHub. Disabled browser storage does not prevent live counts. Without JavaScript, each link still opens the project's stargazers page.

To add a count, copy an existing `.github-stars` link, update its `data-repo` and GitHub URL, and keep the `[data-star-count]` span. The featured tvOS count refers specifically to `compose-tvos`, not a sum across its related repositories.

API reference: https://docs.github.com/en/rest/repos/repos#get-a-repository

## Files

- `index.html`: portfolio content and metadata
- `assets/portfolio.css`: responsive design
- `assets/github-stars.js`: automatic star counts
- `assets/pehra.css`: Pehra support-page design
- `pehra/`: preserved Pehra support and privacy content
