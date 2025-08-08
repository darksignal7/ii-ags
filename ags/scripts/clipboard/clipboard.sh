#!/bin/bash

# Scriptin bulunduğu dizini al
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# JavaScript dosyası yerine JSON dosyası olarak kaydet
JSON_FILE="$SCRIPT_DIR/cliphist_data.json" # Burası değişti!

# cliphist list komutunun çıktısını al
CLIPHIST_OUTPUT=$(cliphist list)

# Çıktıyı işle: numaraları sil, ilk 20 satırı al, boşları filtrele ve JSON array'ine dönüştür
PROCESSED_ARRAY=$(echo "$CLIPHIST_OUTPUT" | \
  head -n 20 | \
  sed -E 's/^[0-9]+\s+//' | \
  grep -v '^$' | \
  jq -R . | \
  jq -s .)

# JSON array'ini doğrudan dosyaya yaz
echo "$PROCESSED_ARRAY" > "$JSON_FILE"
echo " '$JSON_FILE' dosyası güncellendi."