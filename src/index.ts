import * as core from '@actions/core';
import * as github from '@actions/github';
import Mustache from 'mustache';
import omit from 'lodash.omit';

const createDefaultTemplateVars = ({ pull_number, pr_title }: { pr_title: string, pull_number: number }) => {
  const githubEnv = Object.keys(process.env).filter(k => k.match(/^GITHUB_/))
  return {
    ...omit(process.env, ...githubEnv),
    PR_NUMBER: pull_number,
    PR_TITLE: pr_title,
  }
}

const run = async () => {
  const { context } = github;
  const githubToken = core.getInput('token');
  const client = github.getOctokit(githubToken).rest;
  const { number: pull_number } = context.payload.pull_request;

  const { data: pr } = await client.pulls.get({
    ...context.repo,
    pull_number,
  });

  const customVariables = core.getInput('variables');
  let templateVars = createDefaultTemplateVars({ pull_number, pr_title: pr.title });
  if (customVariables.length) {
    const customObject = JSON.parse(customVariables);
    templateVars = { ...templateVars, ...customObject }
  }

  const output = Mustache.render(pr.body || '', templateVars);

  client.pulls.update({
    ...context.repo,
    pull_number,
    body: output,
  });
};

run();
