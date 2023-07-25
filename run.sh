#!/bin/bash
cd ./NeteaseCloudMusicApi #跳转容器相应目录
nohup node app.js &  #执行启动音乐api命令，nohup指在后台运行
cd ../MiguMusicApi
nohup npm start &
cd ../tonzhon-music
nohup npm run server &
cd ../QQMusicApi
PORT=3300 QQ=$1 npm start  #$1,是指执行命令传递过来的第二个参数，第一个参数是entrypoint.sh，第二个参数是qq号
#记得这里不能加nohup让程序在后台运行，因为如果所有应用都在后台运行，docker会自动把这个容器给关闭了。
