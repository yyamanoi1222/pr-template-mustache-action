import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Mustache from 'mustache';

const run = async () => {
  const { context } = github;
  const githubToken = core.getInput('token');
  const client = github.getOctokit(githubToken).rest;

  const { number: pull_number } = context.payload.pull_request;

  const pr = await client.pulls.get({
    ...context.repo,
    pull_number,
  });

  const output = Mustache.render(pr.data.body, { ...process.env });

  client.pulls.update({
    ...context.repo,
    pull_number,
    body: output,
  });
};

run();
