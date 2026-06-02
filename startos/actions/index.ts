import { sdk } from '../sdk'
import { getCredentials } from './getCredentials'
import { configure } from './configure'

export const actions = sdk.Actions.of()
  .addAction(getCredentials)
  .addAction(configure)
