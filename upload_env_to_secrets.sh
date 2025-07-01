#!/bin/bash

REPO="FinbertMDS/sudoku-classic"  # thay bằng tên repo của bạn

while IFS='=' read -r key value
do
  if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
    echo "Setting secret: $key"
    gh secret set "$key" --repo "$REPO" --body "$value"
  fi
done < .env
