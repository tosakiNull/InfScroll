import { Octokit } from '@octokit/core';

const githubToken = process.env.PERSONAL_TOKEN;

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
