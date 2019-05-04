#!/bin/bash

PORT=44466

echo "----------------------------------------------"
echo " Run with nodemon to enable debug in vscode   "
echo "----------------------------------------------"
echo "  - PORT: ${PORT}                             "
echo "  - VS Code launch          
        {
            // [PEI] My Favorite Config - [OK] Attach Pid
            \"type\": \"node\",
            \"request\": \"attach\",
            \"name\": \"Upsala-backend attach://pid\",
            \"processId\": \"\${command:PickProcess}\", 
            \"restart\": true,   // To nodemon
        },
"
echo "----------------------------------------------"

node --version

nodemon --inspect-brk=${PORT} index.js  --host 0.0.0.0

