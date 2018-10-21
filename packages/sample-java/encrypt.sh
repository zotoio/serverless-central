#!/bin/bash

display_usage() {
    echo "Please supply env var name and value to encrypt"
    echo "eg. ./encrypt.sh SLS_CRYPT_MY_VARIABLE supers3cret"
}

if [ $# -eq 0 ]; then
    display_usage
    exit 1
fi

export $(cat .env | grep -v ^# | xargs)
node --require ../../dotenv.js  ../../node_modules/serverless/bin/serverless encrypt -k $SLS_AWS_KMS_KEY_ID -n $1 -v $2
echo '  VAR_TOKEN: ${self:custom.kmsSecrets.secrets.VAR_TOKEN, env:VAR_TOKEN}' | sed "s/VAR_TOKEN/$1/g" >> ./serverless-aws-environment.yml
