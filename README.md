# @ycm.jason/asyncLimit

Limits the concurrent calls to a function.

## Install

```
npm i --save @ycm.jason/async-limit
```


## Usage

```
const readFile = require('util').promisify(require('fs').readFile);
const asyncLimit = requrie('@ycm.jason/async-limit');

const limitedReadFile = asyncLimit(readFile, 10);

// limitedReadFile can only have 10 concurrent calls at the same time
```

## Author 
Jason Yu
