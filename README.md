# Gran Garden Resort - Sistema de Gestão de Obras

## GitHub Pages Deployment Fix

### Problem
GitHub Pages deployment is failing with the error:
```
No such file or directory @ dir_chdir0 - /github/workspace/docs
```

### Root Cause
GitHub Pages is attempting to process the site with Jekyll and looking for source files in a `/docs` directory, but the `gh-pages` branch contains pre-built static files in the root directory.

### Solution
Add a `.nojekyll` file to the `gh-pages` branch to bypass Jekyll processing.

### How to Fix

#### Option 1: Manual Fix (Recommended)
1. Switch to the `gh-pages` branch locally
2. Create an empty `.nojekyll` file in the root:
   ```bash
   git checkout gh-pages
   touch .nojekyll
   git add .nojekyll
   git commit -m "Add .nojekyll to disable Jekyll processing"
   git push origin gh-pages
   ```

#### Option 2: Using the Automated Workflow
1. Merge this PR to add the workflow files
2. Approve and run the "Fix gh-pages deployment" workflow from the Actions tab
3. The workflow will automatically add `.nojekyll` to the gh-pages branch

### Why This Works
The `.nojekyll` file tells GitHub Pages to skip Jekyll processing and serve the files as-is, which is exactly what we need for a pre-built static site.
