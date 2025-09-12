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
  about: string
  last_queried_at: string
  preprocessed_about: string
  label: string
  pts: number
  broadcast: boolean
  participants_count: number
  linked_chats_ids: any
  distance_from_seed: number
  language: string
  n_in_recommendation: number
  explored: string
  expandable: string 
  n_out_recommended: number
  participation_score: number
  message_count: number
  unknown_domains: number
  known_domains: number
  sdIRI: number
  dIRI: number
  unrel: number
  iri: number
  hs: number
  cw: number
  negative_sentiment_percentage: number
  neutral_sentiment_percentage: number
  positive_sentiment_percentage: number
  num_downloaded_messages_main_chat: number
  num_downloaded_messages_all_chats: number
  num_downloaded_messages_withtext_all_chats: number
  maintopic: string
  maintopic_hs: string
  maintopic_cw: string
  maintopic_negative: string
  maintopic_neutral: string
  maintopic_positive: string
  Rec: string
}
  // @Id
  // private String id;
  // private Date date;
  // @Column(name = "last_queried_at")
  // @JsonProperty("last_queried_at")
  // private Date lastQueriedAt;
  // @Column(name = "preprocessed_about")
  // @JsonProperty("preprocessed_about")
  // private String preprocessedAbout;
  // @Column(name = "label")
  // @JsonProperty("label")
  // private String label;
  // private Integer pts;
  // private Boolean broadcast;
  // @Column(name = "participants_count")
  // @JsonProperty("participants_count")
  // private Integer participantsCount;
  // @Column(name = "is_dh_data_available")
  // @JsonProperty("is_dh_data_available")
  // private Integer isDhDataAvailable;
  // @JsonProperty("linked_chats_ids")
  // @Column(name = "linked_chats_ids")
  // private String linkedChatsIds;
  // @JsonProperty("distance_from_seed")
  // @Column(name = "distance_from_seed")
  // private Integer distanceFromSeed;
  // private String language;
  // @JsonProperty("n_in_recommendation")
  // @Column(name = "n_in_recommendation")
  // private Integer nInRecommendation;
  // @JsonProperty("expandable")
  // @Column(name = "expandable")
  // private Boolean expandable;
  // private Boolean explored;
  // @JsonProperty("n_out_recommended")
  // @Column(name = "n_out_recommended")
  // private Integer nOutRecommended;
  // @JsonProperty("participation_score")
  // @Column(name = "participation_score")
  // private Double participationScore;
  // @JsonProperty("message_count")
  // @Column(name = "message_count")
  // private Integer messageCount;
  // @JsonProperty("unknown_domains")
  // @Column(name = "unknown_domains")
  // private Integer unknownDomains;
  // @JsonProperty("known_domains")
  // @Column(name = "known_domains")
  // private Integer knownDomains;
  // private Double IRI, sdIRI, dIRI, unrel,hs,cw;
  // @JsonProperty("negative_sentiment_percentage")
  // @Column(name = "negative_sentiment_percentage")
  // private Double negativeSentimentPercentage;
  // @JsonProperty("neutral_sentiment_percentage")
  // @Column(name = "neutral_sentiment_percentage")
  // private Double neutralSentimentPercentage;
  // @JsonProperty("positive_sentiment_percentage")
  // @Column(name = "positive_sentiment_percentage")
  // private Double positiveSentimentPercentage;
  // @JsonProperty("num_downloaded_messages_main_chat")
  // @Column(name = "num_downloaded_messages_main_chat")
  // private Integer numDownloadedMessagesMainChat;
  // @JsonProperty("num_downloaded_messages_all_chats")
  // @Column(name = "num_downloaded_messages_all_chats")
  // private Integer numDownloadedMessagesAllChats;
  // @JsonProperty("num_downloaded_messages_withtext_all_chats")
  // @Column(name = "num_downloaded_messages_withtext_all_chats")
  // private Integer numDownloadedMessagesWithTextAllChats;
  // @JsonProperty("maintopic")
  // @Column(name = "maintopic")
  // private String maintopic;
  // @JsonProperty("maintopic_hs")
  // @Column(name = "maintopic_hs")
  // private String maintopicHs;
  // @JsonProperty("maintopic_cw")
  // @Column(name = "maintopic_cw")
  // private String maintopicCw;
  // @JsonProperty("maintopic_negative")
  // @Column(name = "maintopic_negative")
  // private String maintopicNegative;
  // @JsonProperty("maintopic_neutral")
  // @Column(name = "maintopic_neutral")
  // private String maintopicNeutral;
  // @JsonProperty("maintopic_positive")
  // @Column(name = "maintopic_positive")
  // private String maintopicPositive;
  // @JsonProperty("Rec")
  // @Column(name = "Rec")
  // private String Rec;

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
  from_user: any
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
  preprocessed_message_media: string
  preprocessed_message_number_media: string
  reactions: Reactions
  replies_to_msg_id: any
  replies_to_msg_text: any
  text_mentions?: any[]
  text_urls?: string[]
  via_bot_id: any,
  hate_label?: string,
  checkworthy_label?: string,
  average_reliability: number,
  topic?: string,
  target?: string,
  keywords_match?: string,
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
export type Sentiment = "neutral" | "positive" | "negative";

export type Topic = { 
  name: string,
   count_percentage: number,
    hs_percentage: number,
    cw_percentage: number,
    npw:any,
    hate_npw:any,
    nonhate_npw:any,
    sentiment_percentage: Sentiment
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
