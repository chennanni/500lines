# helper method for providing error messages for a command
run_or_fail() {
  local explanation=$1
  shift 1 # removing the first parameter
  "$@" # all remaining parameters, which means executing the git cmd in this case
  # output error message
  if [ $? != 0 ]; then
    echo $explanation 1>&2
    exit 1
  fi
}
