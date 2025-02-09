/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "bucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "langdb-api-key": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "langdb-openai-base-url": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "langdb-project-id": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "migrator-pg": {
      "name": string
      "type": "sst.aws.Function"
    }
    "pg": {
      "database": string
      "host": string
      "password": string
      "port": number
      "type": "sst.aws.Postgres"
      "username": string
    }
    "ses": {
      "configSet": string
      "sender": string
      "type": "sst.aws.Email"
    }
    "vpc": {
      "type": "sst.aws.Vpc"
    }
    "www": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}