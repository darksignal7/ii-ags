#!/bin/bash

# Script'in adı: fixed_paths_json.sh
# Bu script, belirtilen sabit bir klasördeki tüm dosyaların yollarını,
# yine sabit bir JSON dosyasına array olarak yazar.

# --- Sabit Ayarlar ---
# Hedef klasörün mutlak veya göreceli yolu.
# Örneğin, script'in çalıştığı yerdeki "Assets/UI/Icons" klasörü.
TARGET_FOLDER="/home/vaguesyntax/Pictures/wallpapers/" 

# Çıktı JSON dosyasının kaydedileceği yer ve adı.
# Örneğin, script'in çalıştığı yerdeki "data/icon_paths.json" dosyası.
OUTPUT_FILE="/home/vaguesyntax/.config/ags/scripts/wallpaper/icon_paths.json" 

# --- Script Başlangıcı ---

echo "Sabit Hedef Klasör: ${TARGET_FOLDER}"
echo "Sabit Çıktı Dosyası: ${OUTPUT_FILE}"

# Çıktı dizini yoksa oluştur.
# Bu komut, OUTPUT_FILE'ın dizin yolunu (örneğin "./data") alır ve yoksa oluşturur.
# Böylece script, "data" klasörü yoksa bile hata vermez.
mkdir -p "$(dirname "${OUTPUT_FILE}")"

# JSON array'ini başlat
echo "[" > "${OUTPUT_FILE}"

# İlk dosya için virgül olmaması için bir bayrak kullanalım
FIRST_FILE=true

# Hedef klasördeki tüm dosyaları (recursive olarak alt klasörler dahil) bul
# -type f sadece dosyaları bulur, klasörleri değil.
# -print0 null karakterle ayrılmasını sağlar, bu da boşluklu dosya adları için önemlidir.
find "${TARGET_FOLDER}" -type f -print0 | while IFS= read -r -d $'\0' file; do
    # Eğer ilk dosya değilse, önceki girdinin sonuna virgül ekle
    if [ "$FIRST_FILE" = false ]; then
        echo "," >> "${OUTPUT_FILE}"
    else
        FIRST_FILE=false
    fi

    # Dosya yolunu JSON string formatına çevir ve dosyaya yaz
    # sed komutu ile ters slashları (/) JSON uyumlu hale getirmek için kaçış karakteri (\/) ekliyoruz.
    ESCAPED_FILE_PATH=$(echo "${file}" | sed 's/\//\\\//g')
    echo "  \"${ESCAPED_FILE_PATH}\"" >> "${OUTPUT_FILE}"
done

# JSON array'ini kapat
echo "]" >> "${OUTPUT_FILE}"

echo "Dosya yolları başarıyla ${OUTPUT_FILE} dosyasına yazıldı."