declare module '@ioc:Rocketseat/Bull' {
  interface BullConnectionsList {
    bull: BullConnectionContract
    direct_uri?: string
  }
}
