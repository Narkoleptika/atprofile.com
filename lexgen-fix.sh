#!/bin/sh

echo "import type {ComAtprotoRepoListRecords, ComAtprotoRepoGetRecord, ComAtprotoRepoCreateRecord, ComAtprotoRepoDeleteRecord} from '@atproto/api'" | cat - src/lexicon/generated/index.ts  > /tmp/out && mv /tmp/out src/lexicon/generated/index.ts
