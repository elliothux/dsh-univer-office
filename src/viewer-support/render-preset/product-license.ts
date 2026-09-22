import { LS_CONFIG_KEY } from '@univerjs-pro/license'
import {
  IConfigService,
  Injector,
  IUniverInstanceService,
  Plugin,
  setDependencies,
  toDisposable,
  UniverInstanceType
} from '@univerjs/core'
import type { ViewLicenseConfig } from './index.js'

/** Apply a host-issued license whose verification key is not bundled with the Univer SDK. */
export class ViewProductLicensePlugin extends Plugin {
  static override pluginName = 'DSH_UNIVER_PRODUCT_LICENSE'
  static override type = UniverInstanceType.UNIVER_UNKNOWN

  private readonly configService: IConfigService
  private readonly instanceService: IUniverInstanceService

  constructor(
    private readonly config: ViewLicenseConfig,
    protected override readonly _injector: Injector
  ) {
    super()
    this.configService = this._injector.get(IConfigService)
    this.instanceService = this._injector.get(IUniverInstanceService)
    this.disposeWithMe(toDisposable(this.instanceService.unitAdded$.subscribe(() => this.apply())))
  }

  override onRendered(): void {
    this.apply()
  }

  override onSteady(): void {
    this.apply()
  }

  private apply(): void {
    if (this.config.pbk === undefined) return
    this.configService.setConfig(LS_CONFIG_KEY, {
      ls: this.config.license,
      pbk: this.config.pbk,
      stv: true
    })
  }
}

setDependencies(ViewProductLicensePlugin, [Injector], 1)
