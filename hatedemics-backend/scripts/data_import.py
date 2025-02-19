import argparse
import numpy as np
import pandas as pd
import os
import json  # Add this import

from sqlalchemy import create_engine, text

def load_channel_data(path, lang):
    channel_data = pd.read_parquet(f'{path}/{lang}/channels.parquet')
    channel_data["linked_chats_ids"] = channel_data["linked_chats_ids"].apply(lambda x: str(x))
    return channel_data

def load_graph_data(path, lang):
    graph_data = pd.read_csv(f'{path}/{lang}/graph_nodes.csv')
    edge_data = pd.read_csv(f'{path}/{lang}/graph_edges.csv')
    return graph_data, edge_data

def load_chats(path, lang):
    chats = []
    for root, dirs, files in os.walk(f'{path}/{lang}/chat_topics'):
        for file in files:
            if file.endswith('.json'):
                chat_id = file.split('.')[0]
                chats.append({"id": chat_id, "lang": lang})
    return pd.DataFrame.from_records(chats)
               

def to_json_str(x):
    if isinstance(x, (list, tuple, np.ndarray)):
        return json.dumps(x.tolist())  # Implement the function to return JSON string representation
    return json.dumps(x)

def process_messages_data(path, lang, engine):
    with engine.connect() as conn:
        conn.execute(text('DROP TABLE IF EXISTS messages'))    

    for root, dirs, files in os.walk(f'{path}/{lang}/messages'):
        for file in files:
            if file.endswith('.parquet'):
                chat_id = file.split('.')[0]
                df = pd.read_parquet(os.path.join(root, file))
                df["channel_id"] = chat_id
                if os.path.exists(f'{path}/{lang}/messages_labels/{chat_id}.tsv'):
                    df_labels = pd.read_csv(f'{path}/{lang}/messages_labels/{chat_id}.tsv', sep = '\t')
                    df = df.merge(df_labels, on='id', how='left')
                df['reactions'] = df['reactions'].apply(lambda x: to_json_str(x))
                df['text_mentions'] = df['text_mentions'].apply(lambda x: to_json_str(x))
                df['text_urls'] = df['text_urls'].apply(lambda x: to_json_str(x))
                df['language'] = lang
                df.to_sql('messages', con=engine, if_exists='append')
                #df.to_parquet(f'{path}/{lang}/merged_messages/{chat_id}.parquet')


def import_data(path, db, lang):
    engine = create_engine(db)

    # Load channel data
    df = load_channel_data(path, lang)
    df['language'] = lang
    df.to_sql('channels', con=engine, if_exists='replace')

    # Load graph data
    graph_data, edge_data = load_graph_data(path, lang)
    graph_data['language'] = lang
    edge_data['language'] = lang    
    graph_data.to_sql('graph_nodes', con=engine, if_exists='replace')
    edge_data.to_sql('graph_edges', con=engine, if_exists='replace')

    chat_data = load_chats(path, lang)
    chat_data.to_sql('chats', con=engine, if_exists='replace')

    # Load messages data
    process_messages_data(path, lang, engine)


if __name__ == '__main__':
    argparser = argparse.ArgumentParser()
    argparser.add_argument('--path', type=str, default='data')
    argparser.add_argument('--db', type=str, default='sqlite:///data.db')
    argparser.add_argument('--lang', type=str, default='IT')
    args = argparser.parse_args()
    import_data(args.path, args.db, args.lang)
