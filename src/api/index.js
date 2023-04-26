// import { Octokit } from '@octokit/core';
// eslint-disable-next-line import/no-unresolved
import { Octokit } from 'https://cdn.skypack.dev/@octokit/core';

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
    per_page: 6,
    page: 1,
    ...query,
  });

  return res;
};
