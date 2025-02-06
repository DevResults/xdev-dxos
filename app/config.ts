import { Config, Defaults, Envs, Local } from '@dxos/config'

export const configProvider = async () => new Config(Envs(), Local(), Defaults())
