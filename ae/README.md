# Editor After Effects extension

An expressions editor After Effects plugin built on top of [Monaco](https://github.com/microsoft/monaco-editor), the editor that powers VS Code.

It includes type definitions for the expressions API via [expression-globals-typescript](https://github.com/motiondeveloper/expression-globals-typescript), providing:

- Autocomplete
- Type-checking
- JSDoc comments

It's built using [Bolt CEP](https://github.com/hyperbrew/bolt-cep/) framework from HyperBrew. That repo contains more information on how to develop the extension.

## Development

**Prerequisites:** git, node and yarn classic (`yarn set version classic`).

```sh
# clone the repo
git clone https://github.com/motiondeveloper/editor.git
# enter the directory for the ae extension
cd editor/ae
# install the dependencies
yarn
# do an initial build (first time only)
yarn build
# add a symlink to the dev build in your extensions folder
yarn symlink
# run the extension in dev mode
yarn dev
```

Then open After Effects and open "Editor" in the Extensions menu.

## Known issues

Currently the editor is working well in dev mode. In production it's pretty broken, the text editor works but the rest of the buttons don't, and the hover UI is buggy.
