## Observer

Process
- thread main:
  - check repo folder for new commit
  - send to dispatcher (with commit id)
  - if anything unusual, raise Exception

Flow
- parse argument
  - dispatcher address
  - repo folder to observe
- periodically check repo folder for new commit
- periodically send new commit (id) to dispatcher
  - ping dispatcher
  - if alive, send new commit (id) to dispatcher
  - if dead, raise exception

## Dispatcher

Process
- thread 1: check available test runners in pool
- thread 2: send commit (id) to test runner for testing
- thread 3: dispatcher server to handle incoming requests

Flow
- parse argument
  - dispatcher server address
- create dispatcher server
- create and start a thread to check available test runners in pool
  - if some test runner is down, remove it from the pool
- create and start a thread to redistribute, this will kick off tests that failed
- define dispatcher handler (which is bind to server)
  - communicate to both observer and test runner, four types of messages
  - status: from observer or test runner, to check if the dispatcher server is alive
  - dispatch: from observer, dispatch a commit for testing
  - register: from test runner, register an instance to pool
  - results: from test runner, save results to file and reply observer with success or fail

## Test Runner

Process
- thread 1: ping dispatcher
- thread 2: test runner server to handle incoming requests

Flow
- parse argument
  - test runner server address
  - dispatcher server address
  - repo folder to test with
- create test runner server
  - get the closet one to the input of test runner server address
- register test runner to dispatcher
- create and start a thread to ping dispatcher
  - if dispatcher is down, close the test runner
- define test runner handler (which is bind to server)
  - only communicate to dispatcher, two types of messages
  - ping: check if test runner is alive
  - runtest: run test with given commit id
