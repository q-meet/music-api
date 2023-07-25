#!/bin/bash
npm i --omit=dev --ignore-scripts
/sbin/tini -- node bin/www
echo "success"