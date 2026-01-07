#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)/.."
PIDS_DIR="$ROOT_DIR/.pids"

if [ -f "$PIDS_DIR/server.pid" ]; then
  kill "$(cat "$PIDS_DIR/server.pid")" || true
  rm "$PIDS_DIR/server.pid"
  echo "Stopped server"
fi

if [ -f "$PIDS_DIR/client.pid" ]; then
  kill "$(cat "$PIDS_DIR/client.pid")" || true
  rm "$PIDS_DIR/client.pid"
  echo "Stopped client"
fi

echo "All stopped (if they were running)"
