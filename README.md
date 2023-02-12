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
        env:
          APP_ENV: test
        with:
          token: ${{ github.token }}
          variables: |
            {
              "var": 1
            }
          copy-env: |
            APP_ENV
    permissions:
        pull-requests: write
```


example PR Template
```
Template example {{var}}
app env is {{APP_ENV}}
```

The above action will update the following text
```
Template example 1
app env is test
```



## preset variables
Environment variables starting with GITHUB_ are provided as presets
