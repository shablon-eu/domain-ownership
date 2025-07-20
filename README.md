# Domain Ownership

[![npm version](https://badge.fury.io/js/@shablon-eu%2Fdomain-ownership.svg)](https://badge.fury.io/js/@shablon-eu%2Fdomain-ownership)

Simple functions to generate a unique value that the domain owner can 
then place either in a file or dns record.

The verify function then ensures that this is called by the actual owner.

Use a private seed for your service to ensure that the value cannot be guessed!

## Generate Keys

```ts
import { generate } from '@shablon-eu/domain-ownership'

const { dns, wellKnown, value } = generate(
  'some-domain.eu', 
  {
    name: 'service', 
    seed: 'randomKey'
  }
)

/*
 * dns = _service.some-domain.eu
 * wellKnown = https://some-domain.eu/.well-known/service
 * value = generated value
 * 
 * the value must be placed EITHER as a DNS TXT entry OR the value 
 * of the well-known file
 */
```

## Validate Domain

```ts
import { verify } from '@shablon-eu/domain-ownership'

const valid = await verify(
  'some-domain.eu',
  {
    name: 'service',
    seed: 'randomKey'
  }
)

if (valid) {
  console.log('ownership verified')
} else {
  console.error('ownership was not verified')
}
```


## Defaults

If no value is passed as name or seed then the following are taken:

```ts
DEFAULT_SEED = "verify-domain"
DEFAULT_NAME = "verify"
```
