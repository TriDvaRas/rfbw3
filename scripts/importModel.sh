#!/bin/bash

# Check if an argument has been provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <model_name>"
    exit 1
fi

# Run the npx command
npx gltfjsx@6.2.3 -T -t -o src/components/Three/Models/$1.tsx garbage/models/$1.glb

# Replace the line in the file
sed -i "s/function Model(/function $1(/g" src/components/Three/Models/$1.tsx

# Move the file
mv ./$1-transformed.glb ./public/