# Backend API Server

Backend API server exposes the infodemics-related data about Telegram chats.

## Data Preparation

Backend relies on the data being organized partially in  DB and partially in data files (for chats).
Specifically, a relational database should contain

- graph data (graph nodes and edges)
- channel metadata
- chat messages

The files should contain the chat topics and chat infodemics metrics and should be organized as follows:

- ``<ROOT_FOLDER> / <LANG> / chat_topics``: should contain the JSON file (``<chat_id>.json``) with the topics info.
- ``<ROOT_FOLDER> / <LANG> / chat_infodemics``: should contain the JSON file (``<chat_id>.json``) with the infodemics info.

To populate the database, it is possible to run ``scrips/data_import.py`` script with the following parameters:

- ``path``: path to the folder with the input data to be used
- ``db``: Database URI to use to create SQLAlchemy engine (defaults to ``sqlite:///data.db``).
- ``lang``: language to process.

The scripts populates the specified database with the data.

For the script to work, the specified folder should be organized as follows:

- ``<LANG>/channels.parquet``: Channel data
- ``<LANG>/graph_edges.csv``: Graph edges
- ``<LANG>/graph_nodes.csv``: Graph nodes
- ``<LANG>/messages/``: messages organized in files (``<chat_id>.parquet`` with a set of messages for each chat)
- ``<LANG>/messages_labels/``: message infodemics metadata organized in files (``<chat_id>.tsv`` with a set of messages for each chat)

## Running the application

The Application represents a Spring boot application and can be run accordingly:

### From the command line

1. Navigate to the project directory:
    ```sh
    cd /Users/raman/workspace/dslab.hatedemics/hatedemics-backend
    ```

2. Build the application:
    ```sh
    ./mvnw clean package
    ```

3. Run the application:
    ```sh
    java -jar target/hatedemics-backend-0.0.1-SNAPSHOT.jar
    ```

Pass the variables as environment or as spring properties, e.g.

    ```sh
    java -P-Dspring.datasource.url=jdbc:sqlite:/path/to/data.db -jar target/hatedemics-backend-0.0.1-SNAPSHOT.jar
    ```


### As a Docker container

1. Build the Docker image:
    ```sh
    docker build -t hatedemics-backend .
    ```

2. Run the Docker container:
    ```sh
    docker run -p 8080:8080 hatedemics-backend
    ```
To correctly use with DB and with data folders, environment and volumes should be configured.