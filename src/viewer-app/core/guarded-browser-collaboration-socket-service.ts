import { ISnapshotServerService } from '@univerjs-pro/collaboration'
import type {
  ICollaborationSocket,
  ICollaborationSocketService
} from '@univerjs-pro/collaboration-client'
import { BrowserCollaborationSocketService } from '@univerjs-pro/collaboration-client-ui'
import {
  IConfigService,
  ILogService,
  Injector,
  setDependencies,
  type Nullable
} from '@univerjs/core'
import { HTTPService } from '@univerjs/network'

/** Prevent late presence cleanup from sending after the SDK has closed its collaboration socket. */
export class GuardedBrowserCollaborationSocketService
  extends BrowserCollaborationSocketService
  implements ICollaborationSocketService
{
  // oxlint-disable-next-line eslint/no-useless-constructor -- redi reads concrete constructor arity.
  constructor(
    injector: Injector,
    httpService: HTTPService,
    configService: IConfigService,
    logService: ILogService,
    snapshotServerService: ISnapshotServerService
  ) {
    super(injector, httpService, configService, logService, snapshotServerService)
  }

  override async createSocket(rawUrl: string): Promise<Nullable<ICollaborationSocket>> {
    const socket = await super.createSocket(rawUrl)
    if (socket === null || socket === undefined) return socket
    let closed = false
    socket.close$.subscribe(() => {
      closed = true
    })
    return {
      get memberID() {
        return socket.memberID
      },
      set memberID(value: string) {
        socket.memberID = value
      },
      open$: socket.open$,
      error$: socket.error$,
      close$: socket.close$,
      message$: socket.message$,
      send(event) {
        if (!closed) socket.send(event)
      },
      close() {
        if (closed) return
        closed = true
        socket.close()
      }
    }
  }
}

setDependencies(GuardedBrowserCollaborationSocketService, [
  Injector,
  HTTPService,
  IConfigService,
  ILogService,
  ISnapshotServerService
])
