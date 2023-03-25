const puppeteer = require('puppeteer');

const scrapeTrendingRepos = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://github.com/trending');
  const repos = await page.evaluate(() => {
    const repoNodes = document.querySelectorAll('article.Box-row');
    return Array.from(repoNodes, repoNode => {
      const titleNode = repoNode.querySelector('h1.h3 > a');
      const descriptionNode = repoNode.querySelector('p.my-1');
      const starsNode = repoNode.querySelector('a.muted-link[href$="stargazers"]');
      const forksNode = repoNode.querySelector('a.muted-link[href$="network/members"]');
      const languageNode = repoNode.querySelector('span[itemprop="programmingLanguage"]');
      return {
        title: titleNode.innerText.trim(),
        description: descriptionNode.innerText.trim(),
        url: 'https://github.com' + titleNode.getAttribute('href'),
        stars: parseInt(starsNode.innerText.trim().replace(',', ''), 10),
        forks: parseInt(forksNode.innerText.trim().replace(',', ''), 10),
        language: languageNode ? languageNode.innerText.trim() : null,
      };
    });
  });
  await browser.close();
  return repos;
};






