#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)/.."
PIDS_DIR="$ROOT_DIR/.pids"
mkdir -p "$PIDS_DIR"

# Start or register server
cd "$ROOT_DIR/server"
existing_server_pid=$(pgrep -f "node index.js" || true)
if [ -n "$existing_server_pid" ]; then
  echo "$existing_server_pid" > "$PIDS_DIR/server.pid"
  echo "Found running server PID $existing_server_pid"
else
  nohup npm start > "$ROOT_DIR/server/server.log" 2>&1 &
  echo $! > "$PIDS_DIR/server.pid"
  echo "Started server PID $(cat "$PIDS_DIR/server.pid")"
fi

# Start or register client
cd "$ROOT_DIR/client"
existing_client_pid=$(pgrep -f "vite" || true)
if [ -n "$existing_client_pid" ]; then
  echo "$existing_client_pid" > "$PIDS_DIR/client.pid"
  echo "Found running client PID $existing_client_pid"
else
  nohup npm start > "$ROOT_DIR/client/client.log" 2>&1 &
  echo $! > "$PIDS_DIR/client.pid"
  echo "Started client PID $(cat "$PIDS_DIR/client.pid")"
fi
