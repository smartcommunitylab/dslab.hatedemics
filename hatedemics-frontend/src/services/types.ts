//types.ts file 

export type APIResponse<T> = {
    success: boolean
    content: T;
    status?: number;
  }
export type ChannelInfo = {
  date: string
  about: string
  pts: number
  broadcast: boolean
  participants_count: number
  id: string
  linked_chats_ids: string
  last_queried_at: string
  distance_from_seed: number
  language: string
  n_in_recommendation: number
  n_out_recommended: string
  participation_score: string
  message_count: string
  unknown_domains: string
  known_domains: string
  IRI: string
  sdIRI: string
  dIRI: string
  unrel: string
  
}
//   Channel Type TODO da rifare
export type Channel = {
  full_chat: FullChat
  chats: Chat[]
  metrics: Metrics
  extended: Extended
  last_queried_at: string
}

export type FullChat = {
  id: string
  about: string
  pts: number
  participants_count: number
}

export type Chat = {
  id: string
  title: string
  date: string
  broadcast: boolean
  access_hash: number
  access_hashes: AccessHashes
}

export type AccessHashes = {
  elisa: number
}

export type Metrics = {
  in_recommendation: string[]
  distance_from_seed: number
  seed: string
  language: string
  pts: number
  participants_count: number
}

export type Extended = {
  recommended_channels: string[]
  participation_score: ParticipationScore
  message_count: number
  url_count: number
}

export type ParticipationScore = {
  participation_score: number
  n_out_recommended: number
}


//   Message Type

export type Message= {
  _: string
  id: number
  peer_id: PeerId
  date: string
  action?: Action
  out: boolean
  mentioned: boolean
  media_unread: boolean
  silent: boolean
  post: boolean
  legacy: boolean
  from_id: any
  reply_to: any
  ttl_period: any
  message?: string
  from_scheduled?: boolean
  edit_hide?: boolean
  pinned?: boolean
  noforwards?: boolean
  invert_media?: boolean
  offline?: boolean
  from_boosts_applied: any
  saved_peer_id: any
  fwd_from?: FwdFrom
  via_bot_id: any
  via_business_bot_id: any
  media?: Media
  reply_markup: any
  entities?: any[]
  views?: number
  forwards?: number
  replies: any
  edit_date?: string
  post_author: any
  grouped_id?: number
  reactions?: Reactions
  restriction_reason?: any[]
  quick_reply_shortcut_id: any
  effect: any
  factcheck: any
  text_urls?: any[]
  text_mentions?: any[]
}

export type PeerId ={
  _: string
  channel_id: string
}

export type Action ={
  _: string
  title: string
}

export type FwdFrom = {
  _: string
  date: string
  imported: boolean
  saved_out: boolean
  from_id: FromId
  from_name: any
  channel_post: number
  post_author: any
  saved_from_peer: any
  saved_from_msg_id: any
  saved_from_id: any
  saved_from_name: any
  saved_date: any
  psa_type: any
}

export type FromId = {
  _: string
  channel_id: string
}

export type Media = {
  _: string
  spoiler: boolean
  photo: Photo
  ttl_seconds: any
}

export type Photo = {
  _: string
  id: number
  access_hash: number
  file_reference: string
  date: string
  sizes: Size[]
  dc_id: number
  has_stickers: boolean
  video_sizes: any[]
}

export type Size = {
  _: string
  type: string
  bytes?: string
  w?: number
  h?: number
  size?: number
  sizes?: number[]
}

export type Reactions = {
  _: string
  results: Result[]
  min: boolean
  can_see_list: boolean
  reactions_as_tags: boolean
  recent_reactions: any[]
  top_reactors: any[]
}

export type Result = {
  _: string
  reaction: Reaction
  count: number
  chosen_order: any
}

export type Reaction = {
  _: string
  emoticon: string
}
export type Topic = {
    id: string
    presence: number
  hate: number
  topic: string}


  //Type for Infodemics ?
  export type Infodemics = {
    urls: string[]
    unknown_domains: number
    known_domains: number
    IRI: number[]
    sdIRI: number[]
    dIRI: number[]
    unrel: number[]
  }
  