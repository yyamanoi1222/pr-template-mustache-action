# pr-template-mustache-action
This action is to provide template engine with mustache for pull request description.

# Usage
See action.yml for the full documentation for this action's inputs and outputs.


## example

```yml
name: pr template

on:
  pull_request:
    types: [opened]

jobs:
  update:
    runs-on: ubuntu-latest

    steps:
      - name: update
        uses: yyamanoi1222/pr-template-mustache-action@main
        with:
          token: ${{ github.token }}
          variables: |
            {
              "var": 1
            }
    permissions:
        pull-requests: write
```

## preset variables
