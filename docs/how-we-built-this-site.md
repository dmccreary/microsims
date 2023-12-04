# How We Built This Site

## GitHub

```sh
mkdir projects
cd projects
git clone https://github.com/dmccreary/microsims
```

### After Changes

```sh
git add -m "comment"
git commit
git push
```

## material

## Conda

```sh
conda deactivate
conda create -n mkdocs python=3
conda activate mkdocs
pip install mkdocs "mkdocs-material[imaging]"
```

## mkdocs

```sh
mkdocs build
mkdocs serve
mkdoc gh-deploy
```

## Social Tags