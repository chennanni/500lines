#!/bin/bash
REPO=$1
COMMIT=$2

source run_or_fail.sh

# updates the repository to the given commit ID

run_or_fail "Repository folder not found" pushd "$REPO" 1> /dev/null # saves the current working directory in memory so it can be returned to at any time
run_or_fail "Could not clean repository" git clean -d -f -x
run_or_fail "Could not call git pull" git pull
run_or_fail "Could not update to given commit hash" git reset --hard "$COMMIT"
