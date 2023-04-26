// import { Octokit } from '@octokit/core';
// eslint-disable-next-line import/no-unresolved
import { Octokit } from 'https://cdn.skypack.dev/@octokit/core';

// const githubToken = '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';
const githubToken = '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';

const octokit = new Octokit({
  auth: githubToken,
});

export const header = {
  'X-GitHub-Api-Version': '2022-11-28',
};

export const getRepos = async (query = {}) => {
  const res = await octokit.request('GET /search/repositories', {
    header,
    q: 'jquery in:name',
    per_page: 6,
    page: 1,
    ...query,
  });

  return res;
};
