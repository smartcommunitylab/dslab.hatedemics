//types.ts file 

export type APIResponse<T> = {
  success: boolean
  content: T;
  status?: number;
  total?: number;

}
export type ChannelInfo = {
  id: string
  date: string
  last_queried_at: string
  about: string
  pts: number
  broadcast: boolean
  participants_count: number
  linked_chats_ids: any
  distance_from_seed: number
  language: string
  n_in_recommendation: number
  n_out_recommended: number
  participation_score: number
  message_count: number
  unknown_domains: number
  known_domains: number
  sdIRI: number
  dIRI: number
  unrel: number
  iri: number

}
//   Channel Type TODO da rifare
export type Channel = {
  full_chat: FullChat
  chats: Chat[]
  metrics: Metrics
  extended: Extended
  last_queried_at: string
}
export type Pageable = {
    page: number
    size: number
    sort: string
}

export type FullChat = {
  id: string
  about: string
  pts: number
  participants_count: number
}

export type Chat = {
  id: string
  // title: string
  // date: string
  // broadcast: boolean
  // access_hash: number
  // access_hashes: AccessHashes
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

export type Message = {
  date: string
  from_id: any
  fwd_from_date: any
  fwd_from_id: any
  fwd_from_msg_id: any
  id: string
  media_type: string
  message: string
  nr_forwards: string
  nr_reactions: string
  nr_replies: string
  nr_views: string
  preprocessed_message: string
  reactions: Reactions
  replies_to_msg_id: any
  replies_to_msg_text: any
  text_mentions: any[]
  text_urls: string[]
  via_bot_id: any,
  hate_label?: string,
  checkworthy_label?: string,
  topic?: string,
  target?: string,
}

export type PeerId = {
  _: string
  channel_id: string
}

export type Action = {
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
  name: string,
   count_percentage: number,
    hs_percentage: number,
    cw_percentage: number,
    npw:any,
    hate_npw:any,
    nonhate_npw:any
   }



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
