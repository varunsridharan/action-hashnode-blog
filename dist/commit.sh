#!/bin/sh

set -e

if [ -z "$GITHUB_TOKEN" ]; then
	echo "🚩  GITHUB_TOKEN Not Found. Please Set It As ENV Variable"
	exit 1
fi

git config --global user.email "githubactionbot+hashnode@gmail.com"
git config --global user.name "Hashnode Bot"

DEST_FILE="${INPUT_FILE}"

GIT_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

git add "${GITHUB_WORKSPACE}/${DEST_FILE}" -f

if [ "$(git status --porcelain)" != "" ]; then
	git commit -m "📚 Latest Blog Updated"
else
	echo "  ✅ Blog List Upto Date"
fi

git push $GIT_URL
