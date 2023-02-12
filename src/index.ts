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

const getEnvVar = (copyEnv: string[]) => {
  return {
    ...omit(process.env, ...copyEnv)
  }
}

const run = async () => {
  const { context } = github;
  const githubToken = core.getInput('token');
  const client = github.getOctokit(githubToken).rest;

  const { pull_request } = context.payload;
  if (!pull_request) {
    core.setFailed("This action is not a pull request");
    return;
  }
  const { number: pull_number } = pull_request;

  const { data: pr } = await client.pulls.get({
    ...context.repo,
    pull_number,
  });

  let templateVars = createDefaultTemplateVars({ pull_number, pr_title: pr.title });
  const customVariables = core.getInput('variables');
  if (customVariables.length) {
    const customObject = JSON.parse(customVariables);
    templateVars = { ...templateVars, ...customObject }
  }
  const copyEnv = core.getMultilineInput('copy-env');
  if (copyEnv.length) {
    templateVars = { ...templateVars, ...(getEnvVar(copyEnv)) }
  }

  const output = Mustache.render(pr.body || '', templateVars);

  client.pulls.update({
    ...context.repo,
    pull_number,
    body: output,
  });
};

run();
