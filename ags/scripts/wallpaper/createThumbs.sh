#!/bin/bash

# Kaynak ve hedef klasörler
SOURCE_DIR="/home/vaguesyntax/Pictures/wallpapers" # Burayı kendi kaynak klasörünle değiştir
DEST_DIR="/home/vaguesyntax/.cache/ags/wallpaper_cache" # Burayı kendi hedef klasörünle değiştir

# Hedef klasör yoksa oluştur
mkdir -p "$DEST_DIR"

echo "Resimler işleniyor..."

# Kaynak klasördeki tüm dosyaları döngüye al
for file in "$SOURCE_DIR"/*; do
    # Dosya mı klasör mü kontrol et
    if [ -f "$file" ]; then
        # Dosya adını al (yol olmadan)
        filename=$(basename "$file")
        filename_png="${filename%.*}.png"
        DEST_FILE="$DEST_DIR/$filename_png"
        

        # Hedef klasörde aynı isimde dosya zaten var mı kontrol et
        if [ -f "$DEST_FILE" ]; then
            echo "Atlandı: '$filename' zaten hedef klasörde mevcut."
        else
            # ImageMagick komutunu çalıştır
            # convert "$file" -resize 10% "$DEST_FILE" # Eski versiyonlar için convert
            echo "DEST_FILE: $DEST_FILE"
            convert -size 192x108 xc:none -draw "roundrectangle 0,0,192,108,20,20" mask.png
            convert "$file" -resize 192x108\! -matte mask.png \
            -compose DstIn -composite "PNG:$DEST_FILE"

            #magick "$file" -resize 192x108\! "$DEST_FILE" # Güncel versiyonlar için magick
            echo "Yeniden boyutlandırıldı: '$filename_png'"
        fi
    fi
done

echo "Tüm resimler başarıyla işlendi!"